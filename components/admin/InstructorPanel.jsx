import Shell from "../Shell";
import Greeting from "../Greeting";
import { signOut } from "../../app/auth-actions";

export default function InstructorPanel({ me, email }) {
  const name = me?.full_name || "Instructor";

  return (
    <Shell>
      <section style={{ paddingTop: 24 }}>
        <div className="portal">
          <aside>
            <b className="side-title">Instructor</b>
            <a className="on" href="#overview">
              Overview
            </a>
            <a href="#classes">My classes</a>
            <a href="/portal">Student portal</a>
            <form action={signOut}>
              <button className="lnk" type="submit">
                Log out
              </button>
            </form>
          </aside>
          <main>
            <div className="p-hero" id="overview">
              <Greeting name={name} badge="Instructor" />
            </div>
            <div className="card" id="classes">
              <h3>Instructor panel</h3>
              <p className="m" style={{ margin: "8px 0 0" }}>
                Signed in as {email || "instructor"}. Class tools (attendance, lessons, quizzes) will show
                here when connected to your courses in Supabase.
              </p>
            </div>
          </main>
        </div>
      </section>
    </Shell>
  );
}