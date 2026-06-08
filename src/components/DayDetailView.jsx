import { useState } from 'react';
import { formatDisplayDate, parseDate, formatDate, today } from '../utils/dates';
import { getScore } from '../utils/habits';
import DayChecklist from './DayChecklist';

export default function DayDetailView({ initialDateKey, data, updateDay, onBack }) {
  const [dateKey, setDateKey] = useState(initialDateKey);
  const todayStr = today();
  const dayData = data.days[dateKey] ?? {};
  const score = getScore(dayData);
  const isToday = dateKey === todayStr;

  const goDay = (dir) => {
    const d = parseDate(dateKey);
    d.setDate(d.getDate() + dir);
    setDateKey(formatDate(d));
  };

  const adjacentLabel = (dir) => {
    const d = parseDate(dateKey);
    d.setDate(d.getDate() + dir);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const scoreMessage = score === 5 ? 'Perfect day!' : score === 0 ? 'Nothing logged yet' : `${5 - score} left`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top bar */}
      <div className="bg-white sticky top-0 z-10 flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-gray-900 leading-tight truncate">
            {formatDisplayDate(dateKey)}
          </h1>
          {isToday && (
            <p className="text-xs text-indigo-500 font-semibold leading-none mt-0.5">Today</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

          {/* Score summary */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  Daily Score
                </p>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-4xl font-bold text-indigo-600">{score}</span>
                  <span className="text-xl font-semibold text-gray-300 ml-0.5">/5</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-1.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        i < score ? 'bg-indigo-500' : 'bg-gray-150 border border-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-xs font-semibold ${score === 5 ? 'text-indigo-500' : 'text-gray-400'}`}>
                  {scoreMessage}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${(score / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Habits */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-700">Habits</p>
            </div>
            <div className="px-5 py-1">
              <DayChecklist
                dayData={dayData}
                onChange={(patch) => updateDay(dateKey, patch)}
                compact
              />
            </div>
          </div>

        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => goDay(-1)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm text-gray-600 font-medium">{adjacentLabel(-1)}</span>
          </button>
          <button
            onClick={() => goDay(1)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm text-gray-600 font-medium">{adjacentLabel(1)}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}
