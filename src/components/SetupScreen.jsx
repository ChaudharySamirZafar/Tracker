import { useState } from 'react';
import { today } from '../utils/dates';

export default function SetupScreen({ onSetup }) {
  const startDate = today();
  const [endDate, setEndDate] = useState('');
  const [calorieTarget, setCalorieTarget] = useState('2000');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!endDate) { setError('Please pick a goal date.'); return; }
    if (endDate <= startDate) { setError('Goal date must be after today.'); return; }
    const cal = parseInt(calorieTarget, 10);
    onSetup(startDate, endDate, cal > 0 ? cal : null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Daily Tracker</h1>
          <p className="text-gray-500 text-sm mt-2">
            Track your daily habits and build a streak to your goal date.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Start date
            </label>
            <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500">
              {startDate} (today)
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Goal date
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => { setEndDate(e.target.value); setError(''); }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Daily calorie target (kcal)
            </label>
            <input
              type="number"
              min="100"
              max="10000"
              step="50"
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(e.target.value)}
              placeholder="e.g. 2000"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 active:scale-95 transition-all mt-2"
          >
            Start Tracking
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            You'll track daily
          </p>
          <ul className="space-y-1.5">
            {['10K Steps', '2L Water', 'Weight (kg)', 'Quran', `Under ${calorieTarget ? `${calorieTarget} kcal` : 'Calories'}`].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
