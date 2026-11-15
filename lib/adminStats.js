// Turns raw rows into one summary object per student: fees, paid, balance, status, attendance.
export function buildStudents({ students, enrollments, payments, attendance, lessons = [], progress = [] }) {
  return students.map((s) => {
    const enr = enrollments.filter((e) => e.student_id === s.id);
    const pay = payments.filter((p) => p.student_id === s.id);
    const att = attendance.filter((a) => a.student_id === s.id);
    const fees = enr.reduce((a, e) => a + e.total_fee, 0);
    const paid = pay.reduce((a, p) => a + p.amount, 0);
    const balance = Math.max(fees - paid, 0);
    const status = fees === 0 ? "none" : paid <= 0 ? "owing" : balance > 0 ? "part" : "paid";
    const present = att.filter((a) => a.present).length;
    // Lessons in the courses this student is enrolled in, and how many they have ticked off.
    const mine = lessons.filter((l) => enr.some((e) => e.course === l.course));
    const done = progress.filter((r) => r.student_id === s.id && mine.some((l) => l.id === r.lesson_id)).length;
    return {
      id: s.id, label: s.full_name || s.email || "Unnamed", email: s.email || "",
      // Students have no email (they use an Access PIN), so we show their phone or Student ID instead.
      sub: s.phone || s.email || s.student_code || "", code: s.student_code || "", phone: s.phone || "",
      accessPlan: s.access_plan || "", accessUntil: s.access_until || "", accessStatus: s.access_status || "active",
      fees, paid, balance, status,
      courses: enr.map((e) => e.course),
      lessonsTotal: mine.length, lessonsDone: done,
      present, total: att.length, pct: att.length ? Math.round((present / att.length) * 100) : 0,
      enrollments: enr, payments: pay,
    };
  });
}
