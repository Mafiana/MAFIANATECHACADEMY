import Link from "next/link";
import Shell from "../Shell";
import { signOut } from "../../app/auth-actions";

const NAV = [
  ["home", "/portal", "Dashboard", "🏠"],
  ["courses", "/portal/courses", "My courses", "📚"],
  ["lessons", "/portal/lessons", "Lessons", "▶️"],
  ["quizzes", "/portal/quizzes", "Quizzes", "❓"],
  ["payments", "/portal/payments", "Payments", "💰"],
  ["attendance", "/portal/attendance", "Attendance", "📅"],
  ["profile", "/portal/profile", "Profile", "👤"],
];

export default function PortalShell({ active, role, children }) {
  const staff = role === "admin" || role === "instructor";

  return (
    <Shell>
      <section style={{ paddingTop: 24 }}>
        <div className="portal">
          <aside className="pnav">
            <b className="side-title">Student portal</b>
            {NAV.map(([k, href, label, icon]) => (
              <Link key={k} href={href} className={k === active ? "on" : ""}>
                <span className="side-icon" aria-hidden="true">
                  {icon}
                </span>{" "}
                {label}
              </Link>
            ))}
            {staff && (
              <Link href="/admin" className={active === "admin" ? "on" : ""}>
                <span className="side-icon" aria-hidden="true">
                  ⚙️
                </span>{" "}
                Admin panel
              </Link>
            )}
            <form action={signOut}>
              <button className="lnk" type="submit">
                Log out
              </button>
            </form>
          </aside>
          <main>{children}</main>
        </div>
      </section>
    </Shell>
  );
}
