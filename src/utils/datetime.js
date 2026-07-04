function parseDateInput(value) {
  if (value == null || value === '') return null;

  const raw = String(value).trim();
  if (/^\d+$/.test(raw)) {
    const d = new Date(parseInt(raw, 10) * 1000);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateParts(d) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}年${m}月${day}日 ${h}:${min}`;
}

/** @param {string|number} ts Unix timestamp in seconds */
export function formatTimestamp(ts) {
  const d = parseDateInput(ts);
  return d ? formatDateParts(d) : null;
}

/** @param {string|number} ts Unix timestamp in seconds */
export function toDateTimeAttr(ts) {
  const seconds = Number(ts);
  if (!Number.isFinite(seconds) || seconds <= 0) return undefined;
  return new Date(seconds * 1000).toISOString();
}
