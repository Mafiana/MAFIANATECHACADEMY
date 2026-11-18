// Clean line icons for the student portal sidebar (same style family as Lucide/Feather).
const P = {
  home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  courses: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5V21.5" /><path d="M9 7h7M9 11h5" /></>,
  lessons: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10.5 9.5 4 2.5-4 2.5z" /></>,
  quizzes: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.1.9-1.1 1.8" /><path d="M12 17h.01" /></>,
  payments: <><rect x="2.5" y="5" width="19" height="14" rx="3" /><path d="M2.5 10h19" /><path d="M6.5 15h4" /></>,
  attendance: <><rect x="3.5" y="5" width="17" height="16" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /><path d="m9 15 2 2 4-4" /></>,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></>,
  admin: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
  bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8.5 3 8.5H3S6 15 6 8" /><path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" /></>,
  userplus: <><circle cx="9.5" cy="8" r="4" /><path d="M2.5 21c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" /><path d="M19 8v6M16 11h6" /></>,
  users: <><circle cx="9" cy="8" r="3.6" /><path d="M2.5 20.5c0-3.6 2.9-5.8 6.5-5.8s6.5 2.2 6.5 5.8" /><path d="M16 4.6a3.6 3.6 0 0 1 0 6.8M18 14.9c2 .7 3.5 2.5 3.5 5.1" /></>,
  enroll: <><rect x="5" y="4" width="14" height="17" rx="2.5" /><path d="M9 4V3h6v1" /><path d="m9 13 2 2 4-4" /></>,
  certificate: <><circle cx="12" cy="9" r="5.5" /><path d="m8.7 13.6-1.7 7 5-2.7 5 2.7-1.7-7" /><path d="m10 9 1.6 1.6L14.5 7.6" /></>,
  shop: <><path d="M5 8h14l-1 12H6z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  megaphone: <><path d="M3 10v4a1 1 0 0 0 1 1h3l8 4V5L7 9H4a1 1 0 0 0-1 1z" /><path d="M19 9.5a4 4 0 0 1 0 5" /></>,
  instructor: <><path d="m2.5 9.5 9.5-5 9.5 5-9.5 5z" /><path d="M6.5 12v4.5c0 1.2 2.5 2.5 5.5 2.5s5.5-1.3 5.5-2.5V12" /><path d="M21.5 9.5V15" /></>,
  download: <><path d="M12 3v12" /><path d="m7 10.5 5 5 5-5" /><path d="M4 20h16" /></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12" /><circle cx="12" cy="12" r="3" /></>,
  logout: <><path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>,
};

export default function Icon({ name, size = 19 }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name]}
    </svg>
  );
}
