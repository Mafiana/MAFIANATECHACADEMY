// Simple icon set used by the portal sidebar and admin.
// Added "download" and kept "megaphone" for Feedback.

const SVG = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

const ICONS = {
  home: (
    <svg {...SVG}><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" /></svg>
  ),
  courses: (
    <svg {...SVG}><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v15H6.5A2.5 2.5 0 004 14.5v-10A2.5 2.5 0 016.5 2z" /></svg>
  ),
  lessons: (
    <svg {...SVG}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /><path d="M10 9l5 3-5 3z" /></svg>
  ),
  quizzes: (
    <svg {...SVG}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
  ),
  payments: (
    <svg {...SVG}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M6 15h4" /></svg>
  ),
  attendance: (
    <svg {...SVG}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M9 14l2 2 4-4" /></svg>
  ),
  profile: (
    <svg {...SVG}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
  ),
  admin: (
    <svg {...SVG}><path d="M12 2l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" /></svg>
  ),
  logout: (
    <svg {...SVG}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
  ),
  download: (
    <svg {...SVG}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
  ),
  megaphone: (
    <svg {...SVG}><path d="M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1z" /><path d="M16 8.5a5 5 0 010 7" /><path d="M19 6a9 9 0 010 12" /></svg>
  ),
  bell: (
    <svg {...SVG}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
  ),
  userplus: (
    <svg {...SVG}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>
  ),
  users: (
    <svg {...SVG}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
  ),
  enroll: (
    <svg {...SVG}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M12 18v-6M9 15h6" /></svg>
  ),
  certificate: (
    <svg {...SVG}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><circle cx="12" cy="15" r="2.5" /><path d="M10.5 17.5L10 20l2-1 2 1-.5-2.5" /></svg>
  ),
  shop: (
    <svg {...SVG}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 01-8 0" /></svg>
  ),
  instructor: (
    <svg {...SVG}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
  ),
  eye: (
    <svg {...SVG}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
};

export default function Icon({ name }) {
  return ICONS[name] || null;
}
