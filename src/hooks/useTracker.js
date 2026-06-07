import { useState, useCallback } from 'react';

const STORAGE_KEY = 'daily-tracker-v1';

const defaultData = { startDate: null, endDate: null, days: {} };

function load() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : defaultData;
  } catch {
    return defaultData;
  }
}

export function useTracker() {
  const [data, setData] = useState(load);

  const persist = useCallback((next) => {
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setup = useCallback(
    (startDate, endDate, calorieTarget) =>
      persist({ startDate, endDate, calorieTarget: calorieTarget || null, days: {} }),
    [persist]
  );

  const updateDay = useCallback(
    (dateKey, patch) =>
      persist({
        ...data,
        days: { ...data.days, [dateKey]: { ...data.days[dateKey], ...patch } },
      }),
    [data, persist]
  );

  const updateSettings = useCallback(
    (patch) => persist({ ...data, ...patch }),
    [data, persist]
  );

  return {
    data,
    isSetup: !!(data.startDate && data.endDate),
    setup,
    updateDay,
    updateSettings,
    getDay: (k) => data.days[k] ?? {},
  };
}
