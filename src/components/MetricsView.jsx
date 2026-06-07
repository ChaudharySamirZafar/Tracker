import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { today, parseDate, formatDate } from '../utils/dates';
import { BOOL_HABITS, getScore } from '../utils/habits';

const FILTERS = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: 'All', days: null },
];

function getStreak(days, todayStr) {
  let streak = 0;
  const d = parseDate(todayStr);
  // If today has no data, start checking from yesterday
  const todayScore = getScore(days[todayStr]);
  if (!todayScore) d.setDate(d.getDate() - 1);
  while (true) {
    const key = formatDate(d);
    if (!days[key] || getScore(days[key]) === 0) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

const chartTickStyle = { fontSize: 10, fill: '#9ca3af' };

export default function MetricsView({ data }) {
  const [filter, setFilter] = useState(30);
  const todayStr = today();

  const filteredEntries = useMemo(() => {
    let cutoff = null;
    if (filter !== null) {
      const d = parseDate(todayStr);
      d.setDate(d.getDate() - filter + 1);
      cutoff = d;
    }
    return Object.entries(data.days)
      .filter(([key]) => !cutoff || parseDate(key) >= cutoff)
      .sort(([a], [b]) => a.localeCompare(b));
  }, [data.days, filter, todayStr]);

  const weightData = useMemo(
    () =>
      filteredEntries
        .filter(([, d]) => d.weight != null && d.weight !== '')
        .map(([key, d]) => ({ date: key.slice(5), weight: parseFloat(d.weight) })),
    [filteredEntries]
  );

  const habitData = useMemo(() => {
    const total = filteredEntries.length;
    return BOOL_HABITS.map((h) => ({
      name: h.label,
      pct: total === 0 ? 0 : Math.round((filteredEntries.filter(([, d]) => d[h.key]).length / total) * 100),
    }));
  }, [filteredEntries]);

  const completionData = useMemo(
    () =>
      filteredEntries.map(([key, d]) => ({
        date: key.slice(5),
        score: getScore(d),
      })),
    [filteredEntries]
  );

  const streak = useMemo(() => getStreak(data.days, todayStr), [data.days, todayStr]);

  const avgScore = useMemo(() => {
    if (filteredEntries.length === 0) return '—';
    const sum = filteredEntries.reduce((acc, [, d]) => acc + getScore(d), 0);
    return (sum / filteredEntries.length).toFixed(1);
  }, [filteredEntries]);

  const totalLogged = useMemo(
    () => filteredEntries.filter(([, d]) => getScore(d) > 0).length,
    [filteredEntries]
  );

  const hasAnyData = filteredEntries.length > 0;

  return (
    <div className="space-y-5">
      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
        {FILTERS.map(({ label, days }) => (
          <button
            key={label}
            onClick={() => setFilter(days)}
            className={`flex-1 py-1.5 text-sm rounded-lg font-semibold transition-colors ${
              filter === days
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Streak</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{streak}</p>
          <p className="text-[11px] text-gray-400">days</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Avg</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{avgScore}</p>
          <p className="text-[11px] text-gray-400">out of 5</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Days</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{totalLogged}</p>
          <p className="text-[11px] text-gray-400">logged</p>
        </div>
      </div>

      {!hasAnyData && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <p className="text-gray-400 text-sm">No data yet. Start logging daily habits to see metrics.</p>
        </div>
      )}

      {/* Weight chart */}
      {weightData.length > 1 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Weight (kg)</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={weightData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={chartTickStyle} />
              <YAxis tick={chartTickStyle} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                formatter={(v) => [`${v} kg`, 'Weight']}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Habit completion bars */}
      {hasAnyData && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Habit Completion Rate</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={habitData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={chartTickStyle} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={chartTickStyle} width={100} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                formatter={(v) => [`${v}%`, 'Completion']}
              />
              <Bar dataKey="pct" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Daily score trend */}
      {completionData.length > 1 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Daily Score Trend</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={completionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={chartTickStyle} />
              <YAxis domain={[0, 5]} tick={chartTickStyle} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                formatter={(v) => [`${v}/5`, 'Score']}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
