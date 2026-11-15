"use server";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { canonicalPin, validPinShape, pinEmail } from "../../lib/pin";
import { accessProblem } from "../../lib/access";

// Signs a student or instructor in with their Access PIN. The PIN is the password; the hidden address is made from it (lib/pin.js).
export async function signInWithPin(_prev, fd) {
  const pin = canonicalPin(fd.get("pin"));
  if (!validPinShape(pin)) return { msg: "That does not look like an Access PIN. It looks like MAF-7K3Q-9X2B." };

  let email;
  try { email = pinEmail(pin); } catch (e) { console.error(e); return { msg: "Sign-in is not set up yet. Please tell the academy." }; }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pin });
  if (error || !data?.user) {
    const banned = /banned|suspend/i.test(error?.message || "");
    return { msg: banned ? "Your access has been paused. Please contact the academy." : "That Access PIN is not valid. Check it and try again, or ask the academy." };
  }

  const { data: p } = await supabase.from("profiles").select("role,access_status,access_until").eq("id", data.user.id).single();
  const problem = accessProblem(p);
  if (problem) { await supabase.auth.signOut(); return { msg: problem }; }

  redirect(p.role === "admin" || p.role === "instructor" ? "/admin" : "/portal"); // throws, so it must stay outside any try/catch
}
