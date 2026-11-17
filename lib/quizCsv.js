// Reads a quiz from CSV text. Works with files saved from Excel or Google Sheets.
//
//   question,option_a,option_b,option_c,option_d,answer
//   What is RAM?,Storage,Memory,A screen,A cable,B
//
// The answer can be a letter (A-F), a number (1-6) or the exact text of the right option.
// Up to 6 options per question. The header row is optional.
export const QUIZ_CSV_TEMPLATE =
  "question,option_a,option_b,option_c,option_d,answer\r\n" +
  "Which part is the brain of the computer?,Monitor,CPU,Keyboard,Printer,B\r\n" +
  "\"Which of these is an input device?\",Mouse,Speaker,Monitor,Projector,A\r\n" +
  "What does RAM stand for?,Random Access Memory,Read Any Message,Run All Modules,Rapid Active Memory,1\r\n";

function rows(text, delim) {
  const out = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"' && cell === "") q = true;
    else if (c === delim) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x.trim() !== "")) out.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== "")) out.push(row);
  return out;
}

export function parseQuizCsv(raw) {
  const text = String(raw || "").replace(/^\uFEFF/, "");
  const first = text.split(/\r?\n/, 1)[0] || "";
  const delim = [",", ";", "\t"].map((d) => [d, first.split(d).length]).sort((a, b) => b[1] - a[1])[0][0];
  const data = rows(text, delim);
  const errors = [];
  if (!data.length) return { questions: [], errors: ["The file is empty."] };

  const norm = (x) => String(x || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
  const head = data[0].map(norm);
  const hasHeader = ["question", "q", "questions"].includes(head[0]);
  let qCol = 0, aCol = -1, optCols = [];
  if (hasHeader) {
    qCol = head.findIndex((h) => ["question", "q", "questions"].includes(h));
    aCol = head.findIndex((h) => ["answer", "correct", "correctanswer", "key"].includes(h));
    optCols = head.map((h, i) => (/^(option|choice)?[a-f1-6]$/.test(h) && h !== "q" ? i : -1)).filter((i) => i >= 0 && i !== qCol && i !== aCol);
    if (aCol < 0) return { questions: [], errors: ["Add an “answer” column (the correct option, such as B)."] };
    if (optCols.length < 2) return { questions: [], errors: ["Add at least two option columns (option_a, option_b, ...)."] };
  }

  const questions = [];
  data.slice(hasHeader ? 1 : 0).forEach((r, k) => {
    const n = k + (hasHeader ? 2 : 1); // the row number as the person sees it in Excel
    const cells = r.map((x) => String(x || "").trim());
    let q, opts, ans;
    if (hasHeader) {
      q = cells[qCol]; ans = cells[aCol];
      opts = optCols.map((i) => cells[i] || "");
      while (opts.length && !opts[opts.length - 1]) opts.pop(); // trailing empty options are simply unused
    } else {
      q = cells[0];
      let end = cells.length;
      while (end > 1 && !cells[end - 1]) end--;
      ans = cells[end - 1]; opts = cells.slice(1, end - 1);
    }
    if (!q) return errors.push(`Row ${n}: the question is empty.`);
    if (opts.length < 2) return errors.push(`Row ${n}: needs at least 2 options.`);
    if (opts.length > 6) return errors.push(`Row ${n}: has more than 6 options.`);
    if (opts.some((o) => !o)) return errors.push(`Row ${n}: an option in the middle is empty.`);
    let idx = -1;
    const a = String(ans || "").trim();
    idx = opts.findIndex((o) => o.toLowerCase() === a.toLowerCase()); // exact option text wins (e.g. answer "4" for options 3, 4, 5)
    if (idx < 0 && /^[a-f]$/i.test(a)) idx = a.toUpperCase().charCodeAt(0) - 65;
    else if (idx < 0 && /^[1-6]$/.test(a)) idx = Number(a) - 1;
    if (idx < 0 || idx >= opts.length) return errors.push(`Row ${n}: the answer “${a || "blank"}” does not match any option.`);
    questions.push({ q: q.slice(0, 300), options: opts.map((o) => o.slice(0, 200)), answer: idx });
  });
  if (questions.length > 50) { errors.unshift(`The file has ${questions.length} questions. A quiz can have at most 50, so split it into two files.`); return { questions: [], errors }; }
  if (!questions.length && !errors.length) errors.push("No questions were found.");
  return { questions, errors };
}
