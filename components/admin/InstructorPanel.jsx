// The panel an instructor sees at /admin. It shows only the courses the admin gave them (none given = every course):
// their students with attendance and progress, the class register, video lessons and quizzes. No fees or payments.
import Shell from "../Shell";
import Greeting from "../Greeting";
import AdminMenuButton from "./AdminMenuButton";
import Register from "./Register";
import Lessons from "./Lessons";
import Quizzes from "./Quizzes";
import LogoutButton from "../portal/LogoutButton";
import { COURSE_NAMES } from "../../lib/courses";
import { fetchAll } from "../../lib/supabase/fetchAll";
import { lagosToday, addDays } from "../../lib/dates";
import { withAttempts } from "../../lib/quizStats";

const WINDOW_DAYS = 120; // attendance percentages cover the last 120 days
const LOW_ATTENDANCE = 60; // flag students below this percentage (after at least 3 classes)

export default async function InstructorPanel({ s, user, name }) {
  const today = lagosToday();

  const { data: scopeRows, error: scopeErr } = await s.from("instructor_courses").select("course").eq("instructor_id", user.id);
  const assigned = !scopeErr && scopeRows?.length ? scopeRows.map((r) => r.course) : null;
  const myCourses = COURSE_NAMES.filter((c) => !assigned || assigned.includes(c));

  const [rosterRes, profRes, attRes, lesRes, quizRes, progRes, qaRes, annRes] = await Promise.all([
    s.rpc("staff_roster"),
    fetchAll(() => s.from("profiles").select("id,full_name,student_code").eq("role", "student").order("id")),
    fetchAll(() => s.from("attendance").select("student_id,class_date,present").gte("class_date", addDays(today, -365)).order("id")),
    s.from("lessons").select("*").order("course").order("position"),
    s.from("quizzes").select("id,course,title,questions,created_at").order("id", { ascending: false }),
    fetchAll(() => s.from("lesson_progress").select("student_id,lesson_id").order("student_id").order("lesson_id")),
    fetchAll(() => s.from("quiz_attempts").select("*").order("id", { ascending: false })),
    s.from("announcements").select("*").order("id", { ascending: false }).limit(3),
  ]);

  const lqMissing = !!(lesRes.error || quizRes.error);
  const roster = (rosterRes.error ? [] : rosterRes.data || []).filter((r) => myCourses.includes(r.course));
  const profById = Object.fromEntries((profRes.data || []).map((p) => [p.id, p]));
  const nameOf = (id) => profById[id]?.full_name || profById[id]?.student_code || "Student";

  const lessons = (lesRes.error ? [] : lesRes.data || []).filter((l) => myCourses.includes(l.course));
  const quizzes = withAttempts((quizRes.error ? [] : quizRes.data || []).filter((z) => myCourses.includes(z.course)), qaRes.error ? [] : qaRes.data || [], nameOf);
  const announcements = annRes.error ? [] : annRes.data || [];

  // ---- per student numbers (only for courses this instructor teaches) ----
  const coursesOf = {};
  for (const r of roster) (coursesOf[r.student_id] ||= new Set()).add(r.course);
  const since = addDays(today, -WINDOW_DAYS);
  const attBy = {};
  for (const a of attRes.data || []) if (a.class_date >= since) (attBy[a.student_id] ||= []).push(a);
  const doneBy = {};
  for (const p of progRes.data || []) (doneBy[p.student_id] ||= new Set()).add(p.lesson_id);
  const bestBy = {}; // student -> quiz -> best percentage
  for (const t of qaRes.data || []) {
    if (!t.total) continue;
    const pct = (t.score / t.total) * 100;
    const m = (bestBy[t.student_id] ||= {});
    if (!(m[t.quiz_id] >= pct)) m[t.quiz_id] = pct;
  }

  const stats = (id) => {
    const cs = coursesOf[id] || new Set();
    const att = attBy[id] || [];
    const present = att.filter((a) => a.present).length;
    const myLessons = lessons.filter((l) => cs.has(l.course));
    const done = myLessons.filter((l) => doneBy[id]?.has(l.id)).length;
    const myQuizIds = quizzes.filter((z) => cs.has(z.course)).map((z) => z.id);
    const scores = myQuizIds.map((q) => bestBy[id]?.[q]).filter((v) => v !== undefined);
    return {
      total: att.length, present, pct: att.length ? Math.round((present / att.length) * 100) : null,
      lessonsDone: done, lessonsTotal: myLessons.length,
      quizAvg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
      quizzesTaken: scores.length, quizzesTotal: myQuizIds.length,
    };
  };

  const studentIds = Object.keys(coursesOf);
  const todayMarked = new Set((attRes.data || []).filter((a) => a.class_date === today).map((a) => a.student_id));
  const registerDone = (c) => { const ids = roster.filter((r) => r.course === c).map((r) => r.student_id); return ids.length > 0 && ids.some((id) => todayMarked.has(id)); };
  const courseCounts = myCourses.map((c) => ({ c, n: roster.filter((r) => r.course === c).length }));

  const picks = studentIds.map((id) => ({ id, label: nameOf(id), sub: profById[id]?.student_code || "" })).sort((a, b) => a.label.localeCompare(b.label));
  const enr = roster.map((r) => ({ id: r.student_id + "|" + r.course, student_id: r.student_id, course: r.course, mode: "", who: nameOf(r.student_id) }));
  const attendance = (attRes.data || []).filter((a) => coursesOf[a.student_id]);

  return (
    <Shell>
      <section style={{ paddingTop: 24 }}>
        <AdminMenuButton />
        <div className="portal">
          <aside id="admin-side">
            <b className="side-title">Instructor panel</b>
            <a className="on" href="#overview">Overview</a>
            <a href="#my-students">My students</a>
            <a href="#attendance">Class register</a>
            <a href="#lessons">Video lessons</a>
            <a href="#quizzes">Quizzes</a>
            <a href="#news">Announcements</a>
            <a href="/portal">My student view</a>
            <LogoutButton />
          </aside>

          <main>
            {rosterRes.error && (
              <div className="adm-msg bad" role="alert">
                Your student list could not be loaded: {rosterRes.error.message}. Ask the admin to run <code>supabase/add-all-features.sql</code> in the Supabase SQL Editor.
              </div>
            )}

            <div className="p-hero" id="overview">
              <Greeting name={name || "Instructor"} badge="Instructor" />
            </div>

            <div className="grid">
              <div className="card"><div className="m">My students</div><h3>{studentIds.length}</h3></div>
              <div className="card"><div className="m">My courses</div><h3>{myCourses.length}</h3><div className="m">{assigned ? "Chosen by the admin" : "All courses"}</div></div>
              <div className="card"><div className="m">Video lessons</div><h3>{lessons.length}</h3></div>
              <div className="card"><div className="m">Quizzes</div><h3>{quizzes.length}</h3></div>
            </div>

            <div className="card">
              <h3>Today’s register</h3>
              {!courseCounts.some((x) => x.n) && <p className="m">No students are enrolled in your courses yet.</p>}
              {courseCounts.filter((x) => x.n).map(({ c, n }) => (
                <div className="stat" key={c}>
                  <span>{c} <span className="m">{n} student{n === 1 ? "" : "s"}</span></span>
                  <b>{registerDone(c) ? "Taken ✓" : "Not taken yet"}</b>
                </div>
              ))}
              <p className="m" style={{ margin: "10px 0 0" }}><a href="#attendance">Go to the class register</a></p>
            </div>

            <div className="card" id="my-students">
              <h3>My students <span className="m">({studentIds.length})</span></h3>
              <p className="m" style={{ margin: "0 0 8px" }}>Attendance is for the last {WINDOW_DAYS} days. Lessons and quizzes count only what is in the student’s own courses.</p>
              {!studentIds.length && <p className="m">No students yet.</p>}
              {courseCounts.filter((x) => x.n).map(({ c, n }) => {
                const ids = roster.filter((r) => r.course === c).map((r) => r.student_id).sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
                return (
                  <details key={c} open={courseCounts.filter((x) => x.n).length === 1}>
                    <summary style={{ cursor: "pointer", fontWeight: 700, padding: "10px 0" }}>{c} <span className="m">({n})</span></summary>
                    {ids.map((id) => {
                      const st = stats(id);
                      const low = st.pct !== null && st.total >= 3 && st.pct < LOW_ATTENDANCE;
                      return (
                        <div className="adm-item" key={c + id}>
                          <div className="adm-item-main" style={{ flexWrap: "wrap" }}>
                            <span><b>{nameOf(id)}</b> <span className="m">{profById[id]?.student_code || ""}</span>{low && <span className="badge bad" style={{ marginLeft: 8 }}>Low attendance</span>}</span>
                            <span className="m">
                              {st.pct === null ? "No classes recorded" : `Attendance ${st.pct}% (${st.present}/${st.total})`}
                              {" · "}Lessons {st.lessonsDone}/{st.lessonsTotal}
                              {" · "}{st.quizAvg === null ? "No quizzes taken" : `Quiz average ${st.quizAvg}% (${st.quizzesTaken}/${st.quizzesTotal})`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </details>
                );
              })}
            </div>

            <Register students={picks} enrollments={enr} attendance={attendance} today={today} />
            <Lessons lessons={lessons} missing={lqMissing} courses={myCourses} />
            <Quizzes quizzes={quizzes} missing={lqMissing} courses={myCourses} />

            <div className="card" id="news">
              <h3>Announcements</h3>
              {!announcements.length && <p className="m">Nothing posted yet.</p>}
              {announcements.map((a) => (
                <div className="adm-item" key={a.id}>
                  <b>{a.title}</b>
                  {a.body && <p className="m" style={{ margin: "4px 0 0" }}>{a.body}</p>}
                </div>
              ))}
            </div>
          </main>
        </div>
      </section>
    </Shell>
  );
}
