import { useEffect } from 'react';
import DayChecklist from './DayChecklist';
import { formatDisplayDate } from '../utils/dates';
import { getScore } from '../utils/habits';

export default function DayModal({ dateKey, dayData, onUpdate, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const score = getScore(dayData);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm shadow-2xl">

        {/* Drag handle */}
        <div className="flex justify-center pt-3">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-3 pb-4">
          <div>
            <h2 className="font-bold text-gray-900 text-lg leading-tight">
              {formatDisplayDate(dateKey)}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      i < score ? 'bg-indigo-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-medium">{score}/5 completed</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Checklist */}
        <div className="px-5 pb-6">
          <DayChecklist dayData={dayData} onChange={onUpdate} compact />
        </div>

      </div>
    </div>
  );
}
