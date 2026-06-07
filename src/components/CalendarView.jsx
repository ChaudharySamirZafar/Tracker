import { useState } from 'react';
import {
  formatMonthYear,
  formatDisplayDate,
  getMonthDays,
  getFirstDayOfMonth,
  getWeekDays,
  today,
  parseDate,
  formatDate,
} from '../utils/dates';
import { getScore } from '../utils/habits';
import DayModal from './DayModal';
import DayChecklist from './DayChecklist';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function scoreStyle(score) {
  if (score === 0) return {};
  return { backgroundColor: `rgba(99, 102, 241, ${0.12 + (score / 5) * 0.55})` };
}

function DayCell({ dateKey, dayData, isToday, onClick }) {
  const score = getScore(dayData);
  const day = parseInt(dateKey.split('-')[2], 10);

  return (
    <button
      onClick={onClick}
      style={scoreStyle(score)}
      className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm select-none active:scale-95 transition-transform
        ${isToday ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}
        ${score === 0 ? 'hover:bg-gray-100' : 'hover:opacity-90'}
      `}
    >
      <span className={`font-semibold leading-none ${isToday ? 'text-indigo-600' : 'text-gray-800'}`}>
        {day}
      </span>
      {score > 0 && (
        <span className="text-[9px] text-indigo-900/70 font-medium mt-0.5 leading-none">
          {score}/5
        </span>
      )}
    </button>
  );
}

export default function CalendarView({ data, updateDay }) {
  const todayStr = today();
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(todayStr);
  const [selectedDay, setSelectedDay] = useState(null);

  const curParts = currentDate.split('-').map(Number); // [year, month(1-based), day]

  const navigate = (dir) => {
    const d = parseDate(currentDate);
    if (view === 'month') d.setMonth(d.getMonth() + dir);
    else if (view === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(formatDate(d));
  };

  const headerTitle = () => {
    if (view === 'month') {
      return formatMonthYear(curParts[0], curParts[1] - 1);
    }
    if (view === 'week') {
      const days = getWeekDays(currentDate);
      const s = days[0].split('-').map(Number);
      const e = days[6].split('-').map(Number);
      const endLabel = new Date(e[0], e[1] - 1, e[2]).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      return `${s[2]} — ${e[2]} ${endLabel}`;
    }
    return formatDisplayDate(currentDate);
  };

  const renderGrid = (days) => (
    <div className="grid grid-cols-7 gap-1">
      {days.map((dateKey, i) =>
        dateKey ? (
          <DayCell
            key={dateKey}
            dateKey={dateKey}
            dayData={data.days[dateKey]}
            isToday={dateKey === todayStr}
            onClick={() => setSelectedDay(dateKey)}
          />
        ) : (
          <div key={`e-${i}`} />
        )
      )}
    </div>
  );

  const renderMonth = () => {
    const y = curParts[0];
    const m = curParts[1] - 1;
    const monthDays = getMonthDays(y, m);
    const firstDay = getFirstDayOfMonth(y, m);
    const cells = [...Array(firstDay).fill(null), ...monthDays];
    // Pad to full rows of 7
    while (cells.length % 7 !== 0) cells.push(null);
    return renderGrid(cells);
  };

  const renderWeek = () => renderGrid(getWeekDays(currentDate));

  const renderDay = () => {
    const dayData = data.days[currentDate] ?? {};
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-700">Habits</span>
          <span className="text-sm font-bold text-indigo-600">{getScore(dayData)}/5</span>
        </div>
        <DayChecklist dayData={dayData} onChange={(patch) => updateDay(currentDate, patch)} calorieTarget={data.calorieTarget} />
      </div>
    );
  };

  return (
    <div>
      {/* View toggle */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4">
        {['month', 'week', 'day'].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-1.5 text-sm rounded-lg font-semibold transition-colors capitalize ${
              view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Nav header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold text-gray-900 text-sm">{headerTitle()}</span>
        <button
          onClick={() => navigate(1)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      {view !== 'day' && (
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="text-center text-[11px] text-gray-400 font-semibold py-1">
              {wd}
            </div>
          ))}
        </div>
      )}

      {view === 'month' && renderMonth()}
      {view === 'week' && renderWeek()}
      {view === 'day' && renderDay()}

      {/* Today shortcut */}
      {currentDate !== todayStr && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setCurrentDate(todayStr)}
            className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Jump to today
          </button>
        </div>
      )}

      {/* Day detail modal */}
      {selectedDay && view !== 'day' && (
        <DayModal
          dateKey={selectedDay}
          dayData={data.days[selectedDay] ?? {}}
          onUpdate={(patch) => updateDay(selectedDay, patch)}
          onClose={() => setSelectedDay(null)}
          calorieTarget={data.calorieTarget}
        />
      )}
    </div>
  );
}
