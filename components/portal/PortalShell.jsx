import Link from "next/link";
import Shell from "../Shell";
import Icon from "./Icons";
import LogoutButton from "./LogoutButton";
import AccessNotice from "./AccessNotice";

const NAV = [
  ["home", "/portal", "Dashboard", "home"],
  ["courses", "/portal/courses", "My courses", "courses"],
  ["lessons", "/portal/lessons", "Lessons", "lessons"],
  ["quizzes", "/portal/quizzes", "Modules", "quizzes"],
  ["payments", "/portal/payments", "Payments", "payments"],
  ["attendance", "/portal/attendance", "Attendance", "attendance"],
  ["profile", "/portal/profile", "Profile", "profile"],
];

export default function PortalShell({ active, role, children }) {
  const staff = role === "admin" || role === "instructor";

  return (
    <Shell portal>
      <section style={{ paddingTop: 24 }}>
        <div className="portal">
          <aside className="pnav">
            <b className="side-title">Student portal</b>
            {NAV.map(([k, href, label, icon]) => (
              <Link key={k} href={href} className={k === active ? "on" : ""}>
                <Icon name={icon} />
                {label}
              </Link>
            ))}
            {staff && (
              <Link href="/admin" className={active === "admin" ? "on" : ""}>
                <Icon name="admin" />
                Admin panel
              </Link>
            )}
            <LogoutButton />
          </aside>
          <main>
            {role === "student" && <AccessNotice />}
            {children}
          </main>
        </div>
      </section>
    </Shell>
  );
}
