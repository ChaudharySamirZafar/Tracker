import { useState } from 'react';
import { today, formatDisplayDate, diffDays } from '../utils/dates';
import { getScore } from '../utils/habits';
import DayChecklist from './DayChecklist';

export default function TodayView({ data, updateDay, updateSettings }) {
  const todayStr = today();
  const [calInput, setCalInput] = useState(() => String(data.calorieTarget ?? ''));

  const saveCalorieTarget = () => {
    const val = parseInt(calInput, 10);
    if (val >= 100 && val <= 10000) {
      updateSettings({ calorieTarget: val });
    } else {
      setCalInput(String(data.calorieTarget ?? ''));
    }
  };
  const dayData = data.days[todayStr] ?? {};
  const score = getScore(dayData);

  const totalDays = data.endDate ? diffDays(data.startDate, data.endDate) : null;
  const elapsed = data.startDate ? diffDays(data.startDate, todayStr) : 0;
  const daysLeft = data.endDate
    ? Math.max(0, diffDays(todayStr, data.endDate))
    : null;
  const overallProgress =
    totalDays && totalDays > 0 ? Math.min(100, Math.round((elapsed / totalDays) * 100)) : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Today</p>
        <h2 className="text-xl font-bold text-gray-900 mt-0.5">
          {formatDisplayDate(todayStr)}
        </h2>
        {daysLeft !== null && (
          <p className="text-sm text-gray-500 mt-1">
            {daysLeft === 0 ? 'Last day — finish strong.' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
          </p>
        )}
      </div>

      {/* Today's score card */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Today's Progress</span>
          <span className="text-sm font-bold text-indigo-600">{score}/5</span>
        </div>
        <div className="flex gap-1.5 mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                i < score ? 'bg-indigo-500' : 'bg-gray-100'
              }`}
            />
          ))}
        </div>
        <DayChecklist dayData={dayData} onChange={(patch) => updateDay(todayStr, patch)} calorieTarget={data.calorieTarget} />
      </div>

      {/* Calorie target */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Daily calorie target</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="100"
              max="10000"
              step="50"
              value={calInput}
              placeholder="—"
              onChange={(e) => setCalInput(e.target.value)}
              onBlur={saveCalorieTarget}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
              className="w-20 text-right px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-400">kcal</span>
          </div>
        </div>
      </div>

      {/* Goal progress */}
      {totalDays !== null && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Goal Progress
            </span>
            <span className="text-xs font-bold text-gray-700">{overallProgress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Day {Math.max(1, elapsed + 1)} of {totalDays + 1} &middot; ends {data.endDate}
          </p>
        </div>
      )}
    </div>
  );
}
