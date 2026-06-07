import { useState } from 'react';
import { useTracker } from './hooks/useTracker';
import SetupScreen from './components/SetupScreen';
import CalendarView from './components/CalendarView';
import TodayView from './components/TodayView';
import MetricsView from './components/MetricsView';

function CalendarIcon({ active }) {
  return (
    <svg
      className={`w-5 h-5 transition-colors ${active ? 'text-indigo-600' : 'text-gray-400'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function TodayIcon({ active }) {
  return (
    <svg
      className={`w-5 h-5 transition-colors ${active ? 'text-indigo-600' : 'text-gray-400'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );
}

function MetricsIcon({ active }) {
  return (
    <svg
      className={`w-5 h-5 transition-colors ${active ? 'text-indigo-600' : 'text-gray-400'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

const TABS = [
  { id: 'calendar', label: 'Calendar', Icon: CalendarIcon },
  { id: 'today', label: 'Today', Icon: TodayIcon },
  { id: 'metrics', label: 'Metrics', Icon: MetricsIcon },
];

export default function App() {
  const { data, isSetup, setup, updateDay, updateSettings } = useTracker();
  const [activeTab, setActiveTab] = useState('today');

  if (!isSetup) {
    return <SetupScreen onSetup={setup} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-lg mx-auto px-4 pt-6">
          {activeTab === 'calendar' && <CalendarView data={data} updateDay={updateDay} />}
          {activeTab === 'today' && <TodayView data={data} updateDay={updateDay} updateSettings={updateSettings} />}
          {activeTab === 'metrics' && <MetricsView data={data} />}
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-lg mx-auto flex">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-opacity active:opacity-70"
            >
              <Icon active={activeTab === id} />
              <span
                className={`text-[11px] font-semibold transition-colors ${
                  activeTab === id ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
