// Dates are handled as plain YYYY-MM-DD text in Lagos time (the academy's time zone).
export const lagosToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });

// Adds whole months to a date, keeping the day where possible (31 Jan + 1 month = 28 Feb).
export function addMonths(ymd, n) {
  const [y, m, d] = ymd.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1 + n, 1));
  const lastDay = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  first.setUTCDate(Math.min(d, lastDay));
  return first.toISOString().slice(0, 10);
}

export const daysBetween = (a, b) => Math.round((Date.parse(b + "T12:00:00Z") - Date.parse(a + "T12:00:00Z")) / 864e5);
export const prettyDate = (ymd) => new Date(ymd + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// Adds (or subtracts) whole days to a YYYY-MM-DD date.
export const addDays = (ymd, n) => new Date(Date.parse(ymd + "T12:00:00Z") + n * 864e5).toISOString().slice(0, 10);
