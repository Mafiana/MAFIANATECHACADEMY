"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// Row Level Security allows these writes only for users whose profile role is 'admin'.
async function run(fn) {
  const s = createClient();
  const { error } = await fn(s);
  if (error) console.error(error.message);
  revalidatePath("/admin");
}

export const enroll = (fd) => run((s) => s.from("enrollments").insert({
  student_id: fd.get("student"), course: fd.get("course"), mode: fd.get("mode"), total_fee: Number(fd.get("fee")),
}));
export const recordPayment = (fd) => run((s) => s.from("payments").insert({
  student_id: fd.get("student"), amount: Number(fd.get("amount")), note: fd.get("note") || null,
}));
export const markAttendance = (fd) => run((s) => s.from("attendance").insert({
  student_id: fd.get("student"), present: fd.get("present") === "yes",
}));
export const issueCertificate = (fd) => run((s) => s.from("enrollments").update({ certificate_issued: true }).eq("id", fd.get("enrollment")));
