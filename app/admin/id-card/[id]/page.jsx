import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Shell from "../../../../components/Shell";
import PrintButton from "../../../../components/PrintButton";
import IdCard from "../../../../components/IdCard";
import { formatStudentId, formatCardDate } from "../../../../lib/id-card";
import { createClient } from "../../../../lib/supabase/server";

export const metadata = { title: "Student ID Card | MAF Tech Academy" };
export const dynamic = "force-dynamic";

export default async function AdminIdCardPage({ params }) {
  const id = params?.id;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const s = createClient();
  const {
    data: { user },
  } = await s.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: me } = await s.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") redirect("/portal");

  const { data: p } = await s
    .from("profiles")
    .select("id, full_name, student_code, gender, avatar_url, access_until, created_at, role")
    .eq("id", id)
    .maybeSingle();
  if (!p || p.role === "admin") notFound();

  const { data: ens } = await s
    .from("enrollments")
    .select("course, created_at")
    .eq("student_id", id)
    .order("id", { ascending: true });

  const program = (ens || []).map((e) => e.course).filter(Boolean).join(", ") || "—";
  const issuedRaw = ens?.[0]?.created_at || p.created_at;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  const code = formatStudentId(p.student_code, issuedRaw);
  const verifyUrl = site ? `${site.replace(/\/$/, "")}/verify?code=${encodeURIComponent(code)}` : "";

  return (
    <Shell>
      <section className="idcard-page">
        <div className="no-print cert-bar" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <Link className="btn ghost" href="/admin#students">
            ← Back to students
          </Link>
          <PrintButton />
        </div>
        <IdCard
          name={p.full_name || "Student"}
          studentId={code}
          gender={p.gender || ""}
          program={program}
          issued={formatCardDate(issuedRaw)}
          validUntil={formatCardDate(p.access_until)}
          photoUrl={p.avatar_url || ""}
          verifyUrl={verifyUrl}
        />
        <p className="no-print m" style={{ textAlign: "center", marginTop: 16 }}>
          Use your browser&apos;s print dialog → Save as PDF or print on card stock.
        </p>
      </section>
    </Shell>
  );
}
