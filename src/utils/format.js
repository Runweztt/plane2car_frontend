/**
 * Shared formatting utilities — single source of truth for all date/time
 * display across dashboards. Using en-GB locale for consistent DD Mon YYYY output.
 */

/**
 * Formats a timestamp as "12 Jun 2026, 14:30"
 * @param {string|Date} ts
 * @returns {string}
 */
export const formatArrival = (ts) => {
  if (!ts) return '—';
  const d = new Date(ts);
  if (isNaN(d)) return String(ts);
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formats a timestamp as "12 Jun at 14:30"
 * @param {string|Date} ts
 * @returns {string}
 */
export const formatArrivalShort = (ts) => {
  if (!ts) return '—';
  const d = new Date(ts);
  if (isNaN(d)) return String(ts);
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${date} at ${time}`;
};

/**
 * Formats a timestamp as "14:30"
 * @param {string|Date} ts
 * @returns {string}
 */
export const formatTime = (ts) => {
  if (!ts) return '—';
  const d = new Date(ts);
  if (isNaN(d)) return String(ts);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};
