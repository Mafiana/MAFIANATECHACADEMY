/** Build display Student ID: MAF{YY}-ST-{number} */
export function formatStudentId(code, when) {
  const digits = String(code || "").replace(/\D/g, "");
  const num = (digits || "0000").slice(-4).padStart(4, "0");
  let yy = "";
  if (when) {
    const d = new Date(when);
    if (!Number.isNaN(d.getTime())) yy = String(d.getFullYear()).slice(-2);
  }
  if (!yy) yy = String(new Date().getFullYear()).slice(-2);
  return `MAF${yy}-ST-${num}`;
}

/** Format MM / YYYY from a date-like value. */
export function formatCardDate(value) {
  if (!value) return "";
  const d = new Date(String(value).length <= 10 ? value + "T12:00:00" : value);
  if (Number.isNaN(d.getTime())) return String(value);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm} / ${yyyy}`;
}
