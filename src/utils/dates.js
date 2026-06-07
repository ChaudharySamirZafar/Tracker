export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDate(date) {
  if (typeof date === 'string') return date;
  const d = date;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Parse YYYY-MM-DD as local midnight (avoids UTC timezone shift)
export function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function diffDays(a, b) {
  return Math.round((parseDate(b) - parseDate(a)) / 86400000);
}

// month is 0-indexed
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Returns array of YYYY-MM-DD strings for all days in the month (0-indexed month)
export function getMonthDays(year, month) {
  const total = getDaysInMonth(year, month);
  return Array.from({ length: total }, (_, i) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
  );
}

// Returns 0=Mon … 6=Sun for the first day of the month (0-indexed month)
export function getFirstDayOfMonth(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

// Returns Mon-Sun array of YYYY-MM-DD for the week containing dateStr
export function getWeekDays(dateStr) {
  const d = parseDate(dateStr);
  const offset = (d.getDay() + 6) % 7; // days since Monday
  const monday = new Date(d);
  monday.setDate(d.getDate() - offset);
  return Array.from({ length: 7 }, (_, i) => {
    const c = new Date(monday);
    c.setDate(monday.getDate() + i);
    return formatDate(c);
  });
}

// month is 0-indexed
export function formatMonthYear(year, month) {
  return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatDisplayDate(dateStr) {
  return parseDate(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(dateStr) {
  return parseDate(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
