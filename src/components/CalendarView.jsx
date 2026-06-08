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
import DayChecklist from './DayChecklist';

const WEEKDAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function scoreStyle(score) {
  if (score === 0) return {};
  return { backgroundColor: `rgba(99, 102, 241, ${0.1 + (score / 5) * 0.5})` };
}

function MonthCell({ dateKey, dayData, isToday, onClick }) {
  const score = getScore(dayData);
  const day = parseInt(dateKey.split('-')[2], 10);
  return (
    <button
      onClick={onClick}
      style={scoreStyle(score)}
      className={`relative flex flex-col items-center pt-2.5 pb-2 rounded-xl select-none active:scale-95 transition-transform
        ${isToday ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}
        ${score === 0 ? 'hover:bg-gray-100' : 'hover:opacity-90'}
      `}
    >
      <span className={`font-semibold text-sm leading-none ${isToday ? 'text-indigo-600' : 'text-gray-800'}`}>
        {day}
      </span>
      <div className="flex gap-px mt-1.5 h-1.5">
        {score > 0 && Array.from({ length: score }, (_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-indigo-600 opacity-70" />
        ))}
      </div>
    </button>
  );
}

export default function CalendarView({ data, updateDay, onSelectDay }) {
  const todayStr = today();
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(todayStr);
  const [weekSelected, setWeekSelected] = useState(null);

  const curParts = currentDate.split('-').map(Number);

  const navigate = (dir) => {
    const d = parseDate(currentDate);
    if (view === 'month') {
      d.setMonth(d.getMonth() + dir);
      setCurrentDate(formatDate(d));
    } else if (view === 'week') {
      d.setDate(d.getDate() + dir * 7);
      const newDate = formatDate(d);
      setCurrentDate(newDate);
      const weekDays = getWeekDays(newDate);
      if (weekSelected && !weekDays.includes(weekSelected)) {
        setWeekSelected(weekDays.includes(todayStr) ? todayStr : null);
      }
    } else {
      d.setDate(d.getDate() + dir);
      setCurrentDate(formatDate(d));
    }
  };

  const headerTitle = () => {
    if (view === 'month') return formatMonthYear(curParts[0], curParts[1] - 1);
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

  const renderMonth = () => {
    const y = curParts[0];
    const m = curParts[1] - 1;
    const monthDays = getMonthDays(y, m);
    const firstDay = getFirstDayOfMonth(y, m);
    const cells = [...Array(firstDay).fill(null), ...monthDays];
    while (cells.length % 7 !== 0) cells.push(null);
    return (
      <>
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS_SHORT.map((wd) => (
            <div key={wd} className="text-center text-[11px] text-gray-400 font-semibold py-1">
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((dateKey, i) =>
            dateKey ? (
              <MonthCell
                key={dateKey}
                dateKey={dateKey}
                dayData={data.days[dateKey]}
                isToday={dateKey === todayStr}
                onClick={() => onSelectDay(dateKey)}
              />
            ) : (
              <div key={`e-${i}`} />
            )
          )}
        </div>
      </>
    );
  };

  const renderWeek = () => {
    const weekDays = getWeekDays(currentDate);
    const active =
      weekSelected && weekDays.includes(weekSelected)
        ? weekSelected
        : weekDays.includes(todayStr)
        ? todayStr
        : weekDays[0];

    const activeData = data.days[active] ?? {};
    const activeScore = getScore(activeData);

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((dateKey, i) => {
            const score = getScore(data.days[dateKey]);
            const day = parseInt(dateKey.split('-')[2], 10);
            const isToday = dateKey === todayStr;
            const isActive = dateKey === active;
            return (
              <button
                key={dateKey}
                onClick={() => setWeekSelected(dateKey)}
                className={`flex flex-col items-center gap-0.5 py-3 rounded-xl transition-colors active:scale-95
                  ${isActive ? 'bg-indigo-600' : isToday ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-100'}
                `}
              >
                <span className={`text-[9px] font-bold uppercase tracking-wide ${isActive ? 'text-indigo-300' : 'text-gray-400'}`}>
                  {WEEKDAYS_SHORT[i]}
                </span>
                <span className={`text-base font-bold leading-none ${isActive ? 'text-white' : isToday ? 'text-indigo-600' : 'text-gray-800'}`}>
                  {day}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${score > 0 ? (isActive ? 'bg-indigo-300' : 'bg-indigo-500') : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">{formatDisplayDate(active)}</p>
              <p className="text-xs text-gray-400 mt-0.5">{activeScore}/5 completed</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i < activeScore ? 'bg-indigo-500' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
          <div className="px-5 py-4">
            <DayChecklist dayData={activeData} onChange={(patch) => updateDay(active, patch)} />
          </div>
        </div>
      </div>
    );
  };

  const renderDay = () => {
    const dayData = data.days[currentDate] ?? {};
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <span className="text-sm font-semibold text-gray-700">Habits</span>
          <span className="text-sm font-bold text-indigo-600">{getScore(dayData)}/5</span>
        </div>
        <div className="px-5 py-4">
          <DayChecklist dayData={dayData} onChange={(patch) => updateDay(currentDate, patch)} />
        </div>
      </div>
    );
  };

  return (
    <div>
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

      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold text-gray-900 text-sm">{headerTitle()}</span>
        <button onClick={() => navigate(1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {view === 'month' && renderMonth()}
      {view === 'week' && renderWeek()}
      {view === 'day' && renderDay()}

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
    </div>
  );
}
