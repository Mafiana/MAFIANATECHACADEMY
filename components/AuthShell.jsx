import Link from "next/link";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth">
      <div className="auth-left">
        <Link className="logo auth-logo" href="/">
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
            <rect width="30" height="30" rx="8" fill="#F2B705" />
            <path d="M6 22V8l9 9 9-9v14" fill="none" stroke="#102019" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          MAFIANA Tech Academy
        </Link>
        <div className="auth-box">
          <h1>{title}</h1>
          <p className="auth-sub">{subtitle}</p>
          {children}
        </div>
        <p className="auth-legal"><Link href="/terms">Terms and Conditions</Link> · <Link href="/privacy">Privacy Policy</Link></p>
      </div>
      <div className="auth-right" aria-hidden="true">
        <svg viewBox="0 0 560 560" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="130" y="170" width="300" height="190" rx="14" fill="rgba(255,255,255,.08)" />
          <path d="M100 380h360l-24 26H124z" fill="rgba(255,255,255,.12)" />
          <circle cx="280" cy="265" r="46" stroke="#F2B705" strokeWidth="5" />
          <path d="M258 266l16 16 30-34" stroke="#F2B705" strokeWidth="6" />
          <path d="M70 90h110a14 14 0 0114 14v56l-24-14H70a14 14 0 01-14-14v-28a14 14 0 0114-14z" />
          <path d="M84 118h60M84 134h36" />
          <rect x="380" y="70" width="120" height="86" rx="10" />
          <path d="M398 96h84M398 114h60M398 132h72" />
          <path d="M470 440l-34-20v-24l34-20 34 20v24z" />
          <path d="M452 424l18 10 18-10" />
          <path d="M70 460l-20 18 20 18M110 460l20 18-20 18M96 452l-14 52" />
          <circle cx="500" cy="230" r="8" /><circle cx="60" cy="250" r="6" /><circle cx="520" cy="330" r="5" />
          <path d="M40 330l12 12M52 330l-12 12M510 190l10 10M520 190l-10 10M300 80l10 10M310 80l-10 10" />
        </svg>
        <div className="auth-quote"><b>Learn. Build. Earn.</b><span>Join students building real skills in computer, data, marketing, design and web development.</span></div>
      </div>
    </div>
  );
}
