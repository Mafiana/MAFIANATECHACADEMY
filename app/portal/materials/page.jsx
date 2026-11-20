import PortalShell from "../../../components/portal/PortalShell";
import { getPortalData } from "../../../lib/portalData";

export const metadata = { title: "Download material | MAF Tech Academy" };

export default async function MaterialsPage() {
  const d = await getPortalData();
  const courses = [...new Set(d.enrollments.map((e) => e.course))];

  // Fetch materials (tolerate missing table)
  let materials = [];
  try {
    const { data } = await d.supabase
      .from("materials")
      .select("id, course, title, file_type, file_url, description")
      .order("sort")
      .order("id");
    materials = data || [];
  } catch {
    materials = [];
  }

  // Filter to student's courses (or show all if none enrolled yet for demo)
  const list = courses.length
    ? materials.filter((m) => courses.includes(m.course))
    : materials;

  const typeLabel = (t) => {
    if (t === "docx") return "Word (.docx)";
    if (t === "ppt" || t === "pptx") return "PowerPoint";
    if (t === "pdf") return "PDF";
    return t;
  };

  return (
    <PortalShell active="materials" role={d.profile?.role} name={d.profile?.full_name}>
      <div>
        <h3 style={{ fontSize: 26 }}>Download material</h3>
        <span className="m" style={{ color: "var(--mute)" }}>
          Course notes, slides and handouts (.docx, PowerPoint, PDF).
        </span>
      </div>

      {!list.length && (
        <div className="card">
          <p className="m" style={{ margin: 0 }}>
            No materials have been uploaded for your courses yet. Check back soon, or ask your instructor.
          </p>
        </div>
      )}

      {courses.map((c) => {
        const items = list.filter((m) => m.course === c);
        if (!items.length) return null;
        return (
          <div className="card" key={c}>
            <h3>{c}</h3>
            {items.map((m) => (
              <div className="stat" key={m.id}>
                <span>
                  <b>{m.title}</b>{" "}
                  <span className="m">
                    · {typeLabel(m.file_type)}
                    {m.description ? ` · ${m.description}` : ""}
                  </span>
                </span>
                <a className="btn sm" href={m.file_url} download target="_blank" rel="noopener noreferrer">
                  Download
                </a>
              </div>
            ))}
          </div>
        );
      })}

      {/* If no enrollments but materials exist, still show them */}
      {!courses.length && list.length > 0 && (
        <div className="card">
          <h3>All materials</h3>
          {list.map((m) => (
            <div className="stat" key={m.id}>
              <span>
                <b>{m.title}</b>{" "}
                <span className="m">
                  · {m.course} · {typeLabel(m.file_type)}
                </span>
              </span>
              <a className="btn sm" href={m.file_url} download target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
