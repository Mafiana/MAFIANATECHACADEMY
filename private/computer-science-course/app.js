// ========== STATE ==========
// When opened from the student portal, progress is kept separately for each student on shared computers.
const STUDENT = window.MAF_STUDENT || null;
const STORAGE_KEY = 'maf_tech_course_progress' + (STUDENT ? ':' + STUDENT.id : '');

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  syncProgress(data);
}

// Inside the student portal, progress is also saved to the academy database so it follows the student to any device.
function syncProgress(data) {
  if (!STUDENT) return;
  try {
    fetch('/portal/course-app/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress: data, total: courseData.modules.length }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

// The saved copy from the database wins. If there is none yet, use this browser's copy and upload it.
let progress = STUDENT && window.MAF_PROGRESS ? window.MAF_PROGRESS : loadProgress();
if (STUDENT && window.MAF_PROGRESS === null && Object.keys(progress).length) syncProgress(progress); // { moduleId: { completed, score }, finalTestPassed: bool, studentName: string }

// ========== RENDER HELPERS ==========
const contentEl = document.getElementById('content');
const navEl = document.getElementById('module-nav');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

function updateProgressBar() {
  const total = courseData.modules.length;
  const done = courseData.modules.filter(m => progress[m.id]?.completed).length;
  const pct = Math.round((done / total) * 100);
  progressFill.style.width = pct + '%';
  progressText.textContent = pct + '%';
}

function renderSidebar(activeId = null) {
  const finalPassed = !!progress.finalTestPassed;

  navEl.innerHTML = `
    <div class="nav-item ${activeId === null ? 'active' : ''}" data-id="home">
      <div class="nav-num">🏠</div>
      <div class="nav-title">Course Home</div>
    </div>
  `;

  courseData.modules.forEach(m => {
    const isDone = progress[m.id]?.completed;
    const isActive = activeId === m.id;
    navEl.innerHTML += `
      <div class="nav-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}" data-id="${m.id}">
        <div class="nav-num">${isDone ? '✓' : m.id}</div>
        <div class="nav-title">${m.title}</div>
      </div>
    `;
  });

  // Final Test
  navEl.innerHTML += `
    <div class="nav-item ${activeId === 'final' ? 'active' : ''}" data-id="final" style="margin-top:12px;border-top:1px solid rgba(255,255,255,0.15);padding-top:12px;">
      <div class="nav-num">📝</div>
      <div class="nav-title">Final Test</div>
    </div>
  `;

  // Certificate (locked / unlocked)
  navEl.innerHTML += `
    <div class="nav-item ${activeId === 'certificate' ? 'active' : ''}" data-id="certificate">
      <div class="nav-num">${finalPassed ? '🎓' : '🔒'}</div>
      <div class="nav-title">Certificate ${finalPassed ? '' : '(Locked)'}</div>
    </div>
  `;

  // Attach click handlers
  navEl.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      if (id === 'home') showHome();
      else if (id === 'final') showFinalTest();
      else if (id === 'certificate') showCertificate();
      else showModule(parseInt(id));
      document.getElementById('sidebar').classList.remove('open');
    });
  });
}

// ========== VIEWS ==========
function showHome() {
  renderSidebar(null);
  updateProgressBar();

  let cards = courseData.modules.map(m => {
    const done = progress[m.id]?.completed;
    return `
      <div class="module-card" data-id="${m.id}">
        <div class="num">MODULE ${m.id}</div>
        <h3>${m.title}</h3>
        <p>${m.short}</p>
        <div class="status ${done ? 'done' : 'todo'}">${done ? '✓ Completed' : 'Not started'}</div>
      </div>
    `;
  }).join('');

  const finalPassed = !!progress.finalTestPassed;

  contentEl.innerHTML = `
    <div class="hero">
      <h1>MAF Tech Academy</h1>
      <p>${courseData.subtitle}</p>
      <p style="margin-top:12px;opacity:0.85;font-size:0.95rem;">${courseData.modules.length} Modules • Practice Activities • Interactive Quizzes • Final Test • Certificate</p>
    </div>
    <h2 style="margin-bottom:18px;color:var(--text);font-size:1.25rem;">Course Modules</h2>
    <div class="module-grid">${cards}</div>

    <div style="margin-top:36px;display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="module-card" data-id="final" style="border:2px solid #1565c0;">
        <div class="num">FINAL ASSESSMENT</div>
        <h3>Final Course Test</h3>
        <p>Questions drawn from all modules. Score 70%+ to unlock your certificate.</p>
        <div class="status ${finalPassed ? 'done' : 'todo'}">${finalPassed ? '✓ Passed' : 'Not yet taken'}</div>
      </div>
      <div class="module-card" data-id="certificate" style="border:2px solid ${finalPassed ? '#2e7d32' : '#9e9e9e'};">
        <div class="num">AWARD</div>
        <h3>Certificate of Completion ${finalPassed ? '' : '🔒'}</h3>
        <p>${finalPassed ? 'Congratulations! Your certificate is ready.' : 'Pass the Final Test to unlock your certificate.'}</p>
        <div class="status ${finalPassed ? 'done' : 'todo'}">${finalPassed ? '✓ Unlocked' : 'Locked'}</div>
      </div>
    </div>
  `;

  contentEl.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      if (id === 'final') showFinalTest();
      else if (id === 'certificate') showCertificate();
      else showModule(parseInt(id));
    });
  });
}

function showModule(id) {
  const mod = courseData.modules.find(m => m.id === id);
  if (!mod) return;

  renderSidebar(id);
  updateProgressBar();

  const topicsHtml = mod.topics.map((t, i) => `
    <div class="topic">
      <h2><span class="t-num">${i + 1}</span> ${t.title}</h2>
      ${t.content}
    </div>
  `).join('');

  const practiceHtml = `
    <div class="practice">
      <h3>📝 Practice Activity</h3>
      <ol>
        ${mod.practice.map(p => `<li>${p}</li>`).join('')}
      </ol>
    </div>
  `;

  const letters = ['A', 'B', 'C', 'D'];
  const quizHtml = mod.quiz.map((q, qi) => `
    <div class="question" data-q="${qi}">
      <h4>Q${qi + 1}. ${q.q}</h4>
      <div class="options">
        ${q.options.map((opt, oi) => `
          <label class="option" data-q="${qi}" data-opt="${oi}">
            <input type="radio" name="q${qi}" value="${oi}" />
            <span class="letter">${letters[oi]}</span>
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');

  const prevId = id > 1 ? id - 1 : null;
  const nextId = id < courseData.modules.length ? id + 1 : null;

  contentEl.innerHTML = `
    <div class="module-header">
      <div class="badge">MODULE ${mod.id} of ${courseData.modules.length}</div>
      <h1>${mod.title}</h1>
    </div>

    <div class="objectives">
      <h3>Learning Objectives</h3>
      <ul>
        ${mod.objectives.map(o => `<li>${o}</li>`).join('')}
      </ul>
    </div>

    ${topicsHtml}
    ${practiceHtml}

    <div class="quiz-section">
      <h2>📋 Module Quiz</h2>
      <p style="margin-bottom:20px;font-size:0.95rem;">Select the best answer for each question, then click <strong>Check Answers</strong>.</p>
      ${quizHtml}
      <div class="quiz-actions">
        <button class="btn btn-primary" id="check-btn">Check Answers</button>
        <button class="btn btn-danger" id="reset-quiz-btn">Reset Quiz</button>
      </div>
      <div class="score-box" id="score-box"></div>
    </div>

    <div class="module-nav-btns">
      ${prevId ? `<button class="btn btn-outline" id="prev-btn">← Previous Module</button>` : '<span></span>'}
      ${nextId ? `<button class="btn btn-primary" id="next-btn">Next Module →</button>` :
        `<button class="btn btn-primary" id="go-final-btn">Go to Final Test →</button>`}
    </div>
  `;

  // Option selection
  contentEl.querySelectorAll('.option').forEach(opt => {
    opt.addEventListener('click', () => {
      const q = opt.dataset.q;
      contentEl.querySelectorAll(`.option[data-q="${q}"]`).forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
    });
  });

  // Check answers
  document.getElementById('check-btn').addEventListener('click', () => {
    let correct = 0;
    mod.quiz.forEach((q, qi) => {
      const selected = contentEl.querySelector(`input[name="q${qi}"]:checked`);
      const options = contentEl.querySelectorAll(`.option[data-q="${qi}"]`);
      options.forEach(o => o.classList.remove('correct', 'wrong', 'selected'));
      if (selected) {
        const chosen = parseInt(selected.value);
        if (chosen === q.answer) {
          correct++;
          options[chosen].classList.add('correct');
        } else {
          options[chosen].classList.add('wrong');
          options[q.answer].classList.add('correct');
        }
      } else {
        options[q.answer].classList.add('correct');
      }
    });

    const total = mod.quiz.length;
    const pct = Math.round((correct / total) * 100);
    const box = document.getElementById('score-box');
    box.classList.add('show');
    box.classList.remove('good', 'ok', 'poor');
    if (pct >= 80) box.classList.add('good');
    else if (pct >= 50) box.classList.add('ok');
    else box.classList.add('poor');
    box.innerHTML = `You scored <strong>${correct} / ${total}</strong> (${pct}%)`;

    if (pct >= 60) {
      progress[id] = { completed: true, score: correct };
      saveProgress(progress);
      updateProgressBar();
      renderSidebar(id);
    }
  });

  // Reset quiz
  document.getElementById('reset-quiz-btn').addEventListener('click', () => {
    contentEl.querySelectorAll('.option').forEach(o => {
      o.classList.remove('selected', 'correct', 'wrong');
    });
    contentEl.querySelectorAll('input[type="radio"]').forEach(i => i.checked = false);
    const box = document.getElementById('score-box');
    box.classList.remove('show', 'good', 'ok', 'poor');
    box.innerHTML = '';
    const btn = document.getElementById('reset-quiz-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Quiz Cleared ✓';
    setTimeout(() => { btn.textContent = originalText; }, 1200);
  });

  // Nav buttons
  if (prevId) {
    document.getElementById('prev-btn').addEventListener('click', () => showModule(prevId));
  }
  if (nextId) {
    document.getElementById('next-btn').addEventListener('click', () => showModule(nextId));
  } else {
    document.getElementById('go-final-btn').addEventListener('click', () => showFinalTest());
  }
}

// ========== FINAL TEST ==========
function showFinalTest() {
  renderSidebar('final');
  updateProgressBar();

  const ft = courseData.finalTest;
  if (!ft) {
    contentEl.innerHTML = '<p>Final test data not found.</p>';
    return;
  }

  const letters = ['A', 'B', 'C', 'D'];
  // Shuffle questions for variety each time (but keep a stable copy)
  let questions = [...ft.questions];

  const quizHtml = questions.map((q, qi) => `
    <div class="question" data-q="${qi}">
      <h4>Q${qi + 1}. ${q.q}</h4>
      <div class="options">
        ${q.options.map((opt, oi) => `
          <label class="option" data-q="${qi}" data-opt="${oi}">
            <input type="radio" name="fq${qi}" value="${oi}" />
            <span class="letter">${letters[oi]}</span>
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');

  contentEl.innerHTML = `
    <div class="module-header">
      <div class="badge">FINAL ASSESSMENT</div>
      <h1>${ft.title}</h1>
      <p style="margin-top:8px;color:var(--text-secondary);">${ft.description}</p>
    </div>

    <div class="quiz-section">
      <h2>📋 Final Course Test (${questions.length} Questions)</h2>
      <p style="margin-bottom:20px;font-size:0.95rem;">Answer all questions. You need <strong>${ft.passPercent}% or higher</strong> to unlock your Certificate.</p>
      ${quizHtml}
      <div class="quiz-actions">
        <button class="btn btn-primary" id="final-check-btn">Submit Final Test</button>
        <button class="btn btn-danger" id="final-reset-btn">Reset Test</button>
      </div>
      <div class="score-box" id="score-box"></div>
    </div>
  `;

  // Option selection
  contentEl.querySelectorAll('.option').forEach(opt => {
    opt.addEventListener('click', () => {
      const q = opt.dataset.q;
      contentEl.querySelectorAll(`.option[data-q="${q}"]`).forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
    });
  });

  // Submit
  document.getElementById('final-check-btn').addEventListener('click', () => {
    let correct = 0;
    questions.forEach((q, qi) => {
      const selected = contentEl.querySelector(`input[name="fq${qi}"]:checked`);
      const options = contentEl.querySelectorAll(`.option[data-q="${qi}"]`);
      options.forEach(o => o.classList.remove('correct', 'wrong', 'selected'));
      if (selected) {
        const chosen = parseInt(selected.value);
        if (chosen === q.answer) {
          correct++;
          options[chosen].classList.add('correct');
        } else {
          options[chosen].classList.add('wrong');
          options[q.answer].classList.add('correct');
        }
      } else {
        options[q.answer].classList.add('correct');
      }
    });

    const total = questions.length;
    const pct = Math.round((correct / total) * 100);
    const box = document.getElementById('score-box');
    box.classList.add('show');
    box.classList.remove('good', 'ok', 'poor');

    if (pct >= ft.passPercent) {
      box.classList.add('good');
      box.innerHTML = `
        <div style="font-size:1.2rem;margin-bottom:8px;">🎉 Congratulations!</div>
        You scored <strong>${correct} / ${total}</strong> (${pct}%)<br>
        You have passed the Final Test. Your Certificate is now unlocked!
        <div style="margin-top:16px;">
          <button class="btn btn-primary" id="view-cert-btn">View Certificate 🎓</button>
        </div>
      `;
      progress.finalTestPassed = true;
      progress.finalTestScore = pct;
      saveProgress(progress);
      renderSidebar('final');

      document.getElementById('view-cert-btn').addEventListener('click', showCertificate);
    } else {
      box.classList.add(pct >= 50 ? 'ok' : 'poor');
      box.innerHTML = `
        You scored <strong>${correct} / ${total}</strong> (${pct}%)<br>
        You need at least <strong>${ft.passPercent}%</strong> to pass. Review the modules and try again.
      `;
    }
  });

  // Reset
  document.getElementById('final-reset-btn').addEventListener('click', () => {
    contentEl.querySelectorAll('.option').forEach(o => o.classList.remove('selected', 'correct', 'wrong'));
    contentEl.querySelectorAll('input[type="radio"]').forEach(i => i.checked = false);
    const box = document.getElementById('score-box');
    box.classList.remove('show', 'good', 'ok', 'poor');
    box.innerHTML = '';
  });
}

// ========== CERTIFICATE ==========
function showCertificate() {
  renderSidebar('certificate');
  updateProgressBar();

  const passed = !!progress.finalTestPassed;

  if (!passed) {
    contentEl.innerHTML = `
      <div class="module-header">
        <div class="badge">CERTIFICATE</div>
        <h1>Certificate of Completion 🔒</h1>
      </div>
      <div class="topic" style="text-align:center;padding:48px 24px;">
        <div style="font-size:4rem;margin-bottom:16px;">🔒</div>
        <h2 style="color:var(--text);margin-bottom:12px;">Certificate Locked</h2>
        <p style="max-width:480px;margin:0 auto 24px;">
          Complete the <strong>Final Course Test</strong> with a score of 70% or higher to unlock your Certificate of Completion.
        </p>
        <button class="btn btn-primary" id="go-final-from-cert">Go to Final Test →</button>
      </div>
    `;
    document.getElementById('go-final-from-cert').addEventListener('click', showFinalTest);
    return;
  }

  // Ask for name if not saved
  const savedName = (progress.studentName || (STUDENT && STUDENT.name) || '').replace(/["<>&]/g, '');

  contentEl.innerHTML = `
    <div class="module-header">
      <div class="badge">CERTIFICATE UNLOCKED</div>
      <h1>Certificate of Completion 🎓</h1>
    </div>

    <div style="margin-bottom:20px;">
      <label style="font-weight:600;display:block;margin-bottom:6px;">Your Full Name (appears on certificate)</label>
      <input id="cert-name" type="text" value="${savedName}" placeholder="Enter your full name"
        style="padding:12px 16px;border:2px solid var(--border);border-radius:8px;font-size:1rem;width:100%;max-width:400px;" />
      <button class="btn btn-primary" id="update-name-btn" style="margin-left:10px;">Update Name</button>
    </div>

    <div id="certificate-preview" style="
      background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
      border: 8px solid #0d47a1;
      border-radius: 12px;
      padding: 48px 40px;
      text-align: center;
      max-width: 700px;
      margin: 0 auto;
      box-shadow: 0 12px 40px rgba(13,71,161,0.15);
      position: relative;
    ">
      <div style="font-size:0.85rem;letter-spacing:3px;color:#1565c0;font-weight:600;margin-bottom:8px;">MAF TECH ACADEMY</div>
      <div style="font-size:1.8rem;font-weight:700;color:#0d47a1;margin-bottom:6px;">Certificate of Completion</div>
      <div style="width:80px;height:3px;background:#00bcd4;margin:16px auto;"></div>
      <p style="color:#546e7a;margin-bottom:8px;">This is to certify that</p>
      <div id="cert-display-name" style="font-size:1.6rem;font-weight:700;color:#1a237e;margin:12px 0 16px;font-family:Georgia,serif;">
        ${savedName || '________________________'}
      </div>
      <p style="color:#455a64;max-width:480px;margin:0 auto 20px;line-height:1.6;">
        has successfully completed the <strong>Interactive Computer Science Course</strong>
        (Beginner to Advanced) covering computer fundamentals, productivity tools,
        internet skills, and practical digital skills, and has passed the Final Assessment.
      </p>
      <div style="display:flex;justify-content:space-around;margin-top:32px;flex-wrap:wrap;gap:16px;">
        <div>
          <div style="font-size:0.8rem;color:#78909c;">Final Score</div>
          <div style="font-weight:700;color:#0d47a1;font-size:1.2rem;">${progress.finalTestScore || '—'}%</div>
        </div>
        <div>
          <div style="font-size:0.8rem;color:#78909c;">Date</div>
          <div style="font-weight:700;color:#0d47a1;font-size:1.1rem;">${new Date().toLocaleDateString()}</div>
        </div>
        <div>
          <div style="font-size:0.8rem;color:#78909c;">Modules</div>
          <div style="font-weight:700;color:#0d47a1;font-size:1.1rem;">${courseData.modules.length}</div>
        </div>
      </div>
      <div style="margin-top:36px;font-size:0.85rem;color:#90a4ae;">MAF Tech Academy • Interactive Computer Science Course</div>
    </div>

    <div style="text-align:center;margin-top:28px;">
      <button class="btn btn-primary" id="print-cert-btn">🖨️ Print / Save Certificate</button>
    </div>
  `;

  document.getElementById('update-name-btn').addEventListener('click', () => {
    const name = document.getElementById('cert-name').value.trim();
    if (name) {
      progress.studentName = name;
      saveProgress(progress);
      document.getElementById('cert-display-name').textContent = name;
    }
  });

  document.getElementById('print-cert-btn').addEventListener('click', () => {
    const name = document.getElementById('cert-name').value.trim();
    if (name) {
      progress.studentName = name;
      saveProgress(progress);
      document.getElementById('cert-display-name').textContent = name;
    }
    window.print();
  });
}

// ========== INIT ==========
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// Modal box (replaces the browser's confirm dialog). Resolves true if the student confirms.
function askConfirm(title, message, confirmLabel) {
  return new Promise((resolve) => {
    const before = document.activeElement;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<h3 id="modal-title"></h3><p></p>' +
      '<div class="modal-actions">' +
      '<button type="button" class="btn btn-outline" data-act="no">Cancel</button>' +
      '<button type="button" class="btn btn-danger" data-act="yes"></button>' +
      '</div></div>';
    overlay.querySelector('h3').textContent = title;
    overlay.querySelector('p').textContent = message;
    overlay.querySelector('[data-act="yes"]').textContent = confirmLabel || 'Confirm';
    function done(answer) {
      document.removeEventListener('keydown', onKey, true);
      overlay.remove();
      if (before && before.focus) before.focus();
      resolve(answer);
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.stopPropagation(); done(false); }
      else if (e.key === 'Tab') {
        const items = overlay.querySelectorAll('button');
        const a = items[0], z = items[items.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    }
    overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) done(false); });
    overlay.querySelector('[data-act="no"]').addEventListener('click', () => done(false));
    overlay.querySelector('[data-act="yes"]').addEventListener('click', () => done(true));
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(overlay);
    overlay.querySelector('[data-act="no"]').focus();
  });
}

document.getElementById('reset-progress').addEventListener('click', async () => {
  const ok = await askConfirm(
    'Reset all progress?',
    'This clears your module progress, the Final Test and your Certificate. This cannot be undone.',
    'Reset progress'
  );
  if (ok) {
    progress = {};
    saveProgress(progress);
    showHome();
  }
});

// Start
if (typeof courseData === "undefined" || !courseData.modules) {
  document.getElementById("content").innerHTML = "<div style=\"padding:40px;color:#c62828;\"><h2>Error loading course data</h2><p>Please refresh the page or re-download the course files.</p></div>";
  console.error("courseData failed to load");
} else {
  showHome();
}
