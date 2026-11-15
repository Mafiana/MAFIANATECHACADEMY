import { lagosToday, prettyDate, daysBetween } from "./dates";

// Why a signed-in person may not use the portal right now, or null if they may.
// Staff (admin, instructor) have no end date. Students' access ends on access_until.
export function accessProblem(p, today = lagosToday()) {
  if (!p) return "We could not find your account. Please contact the academy.";
  if (p.access_status === "revoked") return "Your access has been paused. Please contact the academy.";
  // A student needs a plan with an end date. Accounts the admin did not create (no end date) are never active.
  if (p.role === "student" && !p.access_until) return "Your account has no active plan yet. Please contact the academy.";
  if (p.role === "student" && p.access_until < today) return `Your access ended on ${prettyDate(p.access_until)}. Message the academy to renew it.`;
  return null;
}

// "Active until 14 March 2027 (45 days left)" for the dashboard and admin screens.
export function accessSummary(p, today = lagosToday()) {
  if (!p?.access_until) return null;
  const left = daysBetween(today, p.access_until);
  return { until: p.access_until, left, soon: left >= 0 && left <= 7, expired: left < 0 };
}
