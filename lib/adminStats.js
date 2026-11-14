// Turns raw rows into one summary object per student: fees, paid, balance, status, attendance.
export function buildStudents({ students, enrollments, payments, attendance }) {
  return students.map((s) => {
    const enr = enrollments.filter((e) => e.student_id === s.id);
    const pay = payments.filter((p) => p.student_id === s.id);
    const att = attendance.filter((a) => a.student_id === s.id);
    const fees = enr.reduce((a, e) => a + e.total_fee, 0);
    const paid = pay.reduce((a, p) => a + p.amount, 0);
    const balance = Math.max(fees - paid, 0);
    const status = fees === 0 ? "none" : paid <= 0 ? "owing" : balance > 0 ? "part" : "paid";
    const present = att.filter((a) => a.present).length;
    return {
      id: s.id, label: s.full_name || s.email || "Unnamed", email: s.email || "",
      fees, paid, balance, status,
      courses: enr.map((e) => e.course),
      present, total: att.length, pct: att.length ? Math.round((present / att.length) * 100) : 0,
      enrollments: enr, payments: pay,
    };
  });
}
