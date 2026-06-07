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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900 text-base">
              {formatDisplayDate(dateKey)}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{score}/5 completed</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">
          <DayChecklist dayData={dayData} onChange={onUpdate} />
        </div>
        {/* Score bar */}
        <div className="px-5 pb-5">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${(score / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
