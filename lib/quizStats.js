// The Quizzes screens need each quiz with its question count and its attempts (with the student's name).
export function withAttempts(quizzes, attempts, nameOf) {
  const by = {};
  for (const t of attempts || []) (by[t.quiz_id] ||= []).push({ ...t, who: nameOf(t.student_id) });
  return (quizzes || []).map((z) => ({
    id: z.id,
    course: z.course,
    title: z.title,
    created_at: z.created_at,
    count: Array.isArray(z.questions) ? z.questions.length : 0,
    attempts: (by[z.id] || []).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))),
  }));
}
