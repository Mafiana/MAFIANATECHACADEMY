import Link from "next/link";
import Shell from "../Shell";
import { signOut } from "../../app/auth-actions";

const NAV = [
  ["home", "/portal", "Dashboard"],
  ["courses", "/portal/courses", "My courses"],
  ["lessons", "/portal/lessons", "Lessons"],
  ["quizzes", "/portal/quizzes", "Quizzes"],
  ["payments", "/portal/payments", "Payments"],
  ["attendance", "/portal/attendance", "Attendance"],
  ["profile", "/portal/profile", "Profile"],
];

export default function PortalShell({ active, role, children }) {
  return (
    <Shell>
      <section style={{ paddingTop: 24 }}>
        <div className="portal">
          <aside className="pnav">
            <b className="side-title">Student portal</b>
            {NAV.map(([k, href, label]) => (
              <Link key={k} href={href} className={k === active ? "on" : ""} aria-current={k === active ? "page" : undefined}>{label}</Link>
            ))}
            {role === "admin" && <Link href="/admin">Admin panel</Link>}
            <form action={signOut}><button className="lnk">Log out</button></form>
          </aside>
          <main>{children}</main>
        </div>
      </section>
    </Shell>
  );
}
