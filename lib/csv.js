// Turns a header list and rows into CSV text that Excel and Google Sheets open correctly.
// Values starting with = + - @ get a leading apostrophe so a spreadsheet can never run them as a formula.
const cell = (v) => {
  let t = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(t) && !/^-?\d+(\.\d+)?$/.test(t)) t = "'" + t;
  return /[",\r\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
};

export function toCsv(headers, rows) {
  const lines = [headers, ...rows].map((r) => r.map(cell).join(","));
  return "\uFEFF" + lines.join("\r\n") + "\r\n"; // BOM so Excel shows names with accents correctly
}
