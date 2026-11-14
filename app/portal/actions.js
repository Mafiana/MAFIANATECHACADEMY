"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// Marks a quiz on the server (the database function holds the answers), saves the score and returns the result.
export async function submitQuiz(_prev, fd) {
  try {
    const quiz = Number(fd.get("quiz"));
    let answers;
    try { answers = JSON.parse(String(fd.get("answers") || "[]")); } catch { return { ok: false, msg: "Could not read your answers." }; }
    if (!Number.isInteger(quiz) || quiz <= 0 || !Array.isArray(answers) || answers.length > 100) return { ok: false, msg: "Could not read your answers." };
    const { data, error } = await createClient().rpc("submit_quiz", { p_quiz: quiz, p_answers: answers });
    if (error) return { ok: false, msg: error.message };
    revalidatePath("/portal/quizzes");
    return { ok: true, msg: "", score: data.score, total: data.total, key: data.key };
  } catch (e) {
    console.error(e);
    return { ok: false, msg: "Something went wrong. Please try again." };
  }
}
