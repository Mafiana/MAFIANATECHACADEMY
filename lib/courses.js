import { CATALOG } from "./catalog";

// Everything here is built from lib/catalog.js, so a course is only ever edited in one place.
export const COURSE_NAMES = CATALOG.map((c) => c.name);
export const naira = (x) => "₦" + Number(x || 0).toLocaleString("en-NG");

// Default course fees (naira) used to pre-fill the admin forms.
export const COURSE_FEES = Object.fromEntries(CATALOG.map((c) => [c.name, { physical: c.physical, online: c.online }]));
// Picture for each course, used on the homepage, the catalog and in the student portal.
export const COURSE_IMAGES = Object.fromEntries(CATALOG.map((c) => [c.name, c.image]));
// Length of each course in weeks (used to suggest how long a student's access should last).
export const COURSE_WEEKS = Object.fromEntries(CATALOG.map((c) => [c.name, c.weeks]));
