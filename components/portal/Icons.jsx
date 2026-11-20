// Portal + admin sidebar icons — clear, consistent size

const BASE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: 22,
  height: 22,
  "aria-hidden": true,
};

const ICONS = {
  // Dashboard — house
  home: (
    <svg {...BASE}>
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5 10.5V20h14V10.5" />
      <path d="M10 20v-6h4v6" />
    </svg>
  ),

  // My courses — open book
  courses: (
    <svg {...BASE}>
      <path d="M4 5v14a1 1 0 001 1h3.5a2 2 0 011.6.8l.9 1.2.9-1.2a2 2 0 011.6-.8H19a1 1 0 001-1V5a1 1 0 00-1-1h-3.5a3 3 0 00-2.5 1.2L12 6.5 10.5 5.2A3 3 0 008 4H4.5A1 1 0 004 5z" />
      <path d="M12 6.5V20" />
    </svg>
  ),

  // Lessons — monitor + play
  lessons: (
    <svg {...BASE}>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M10 8.5l5 3-5 3V8.5z" fill="currentColor" stroke="none" />
    </svg>
  ),

  // Modules / Quizzes — checklist
  quizzes: (
    <svg {...BASE}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4 6l1.5 1.5L8 5" />
      <path d="M4 12l1.5 1.5L8 11" />
      <path d="M4 18l1.5 1.5L8 17" />
    </svg>
  ),

  // Download material
  download: (
    <svg {...BASE}>
      <path d="M12 4v11" />
      <path d="M8 11l4 4 4-4" />
      <path d="M5 19h14" />
    </svg>
  ),

  // Payments — card
  payments: (
    <svg {...BASE}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  ),

  // Attendance — calendar with check
  attendance: (
    <svg {...BASE}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  ),

  // Feedback — megaphone
  megaphone: (
    <svg {...BASE}>
      <path d="M3 11v2a1 1 0 001 1h1.5l4.5 3.5V6.5L5.5 10H4a1 1 0 00-1 1z" />
      <path d="M15 9.2a3.5 3.5 0 010 5.6" />
      <path d="M17.5 7a6 6 0 010 10" />
    </svg>
  ),

  // Profile — person
  profile: (
    <svg {...BASE}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
    </svg>
  ),

  // Admin
  admin: (
    <svg {...BASE}>
      <path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5L12 14.5 7.5 17l.9-5L4.8 8.2l5-.7L12 3z" />
    </svg>
  ),

  // Logout
  logout: (
    <svg {...BASE}>
      <path d="M10 17H5a2 2 0 01-2-2V7a2 2 0 012-2h5" />
      <path d="M15 14l4-4-4-4" />
      <path d="M19 10H10" />
    </svg>
  ),

  // Extra icons used by admin
  bell: (
    <svg {...BASE}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  userplus: (
    <svg {...BASE}>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  ),
  users: (
    <svg {...BASE}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  enroll: (
    <svg {...BASE}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M12 18v-6M9 15h6" />
    </svg>
  ),
  certificate: (
    <svg {...BASE}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <circle cx="12" cy="15" r="2.5" />
      <path d="M10.5 17.5L10 20l2-1 2 1-.5-2.5" />
    </svg>
  ),
  shop: (
    <svg {...BASE}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <path d="M3 6h18M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  instructor: (
    <svg {...BASE}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  eye: (
    <svg {...BASE}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

export default function Icon({ name }) {
  return ICONS[name] || null;
}
