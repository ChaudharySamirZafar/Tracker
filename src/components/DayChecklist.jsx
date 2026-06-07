import { HABITS } from '../utils/habits';

function Checkbox({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
        checked
          ? 'bg-indigo-600 border-indigo-600'
          : 'border-gray-300 bg-white hover:border-indigo-400'
      }`}
    >
      {checked && (
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}

export default function DayChecklist({ dayData, onChange, calorieTarget }) {
  const handleBool = (key) => onChange({ [key]: !dayData[key] });

  const handleWeight = (e) => {
    const val = e.target.value;
    onChange({ weight: val === '' ? null : parseFloat(val) });
  };

  return (
    <div className="space-y-4">
      {HABITS.map((habit) => (
        <div key={habit.key} className="flex items-center justify-between min-h-[36px]">
          <span className="text-sm font-medium text-gray-700">
            {habit.key === 'underCalories' && calorieTarget
              ? `Under ${calorieTarget} kcal`
              : habit.label}
          </span>
          {habit.type === 'bool' ? (
            <Checkbox
              checked={!!dayData[habit.key]}
              onChange={() => handleBool(habit.key)}
            />
          ) : (
            <input
              type="number"
              step="0.1"
              min="0"
              max="999"
              placeholder="—"
              value={dayData.weight ?? ''}
              onChange={handleWeight}
              className="w-20 text-right px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          )}
        </div>
      ))}
    </div>
  );
}
