// Game page — supports Question Mode and Select Answer Mode
let activeTimer = null;

function renderGame(state) {
  const app = document.getElementById('app');
  const { question, questionIndex, total, answerer, guesser, myId, timePerQuestion, gameMode, choices } = state;

  const isAnswerer = answerer.id === myId;
  const isSelectMode = gameMode === 'select';

  const myQuestionEn = isAnswerer
    ? question.en
    : question.en.replace(/\byour\b/gi, `${answerer.name}'s`);

  const myQuestionAr = isAnswerer
    ? question.ar
    : (question.ar_about
        ? question.ar_about.replace(/\{name\}/g, answerer.name)
        : question.ar
            .replace(/لك\b/g, `لـ${answerer.name}`)
            .replace(/عندك\b/g, `عند ${answerer.name}`)
            .replace(/تحبه\b/g, `يحبه ${answerer.name}`)
            .replace(/تفضله\b/g, `يفضله ${answerer.name}`)
            .replace(/تفضل\b/g, `يفضل ${answerer.name}`)
            .replace(/تخافه\b/g, `يخافه ${answerer.name}`)
            .replace(/تكرهه\b/g, `يكرهه ${answerer.name}`)
            .replace(/لديك\b/g, `لدى ${answerer.name}`)
            .replace(/موهبتك\b/g, `موهبة ${answerer.name}`)
            .replace(/حلمك\b/g, `حلم ${answerer.name}`)
            .replace(/خوفك\b/g, `خوف ${answerer.name}`)
            .replace(/\bأنت\b/g, answerer.name));

  const placeholderText = isAnswerer
    ? 'Your answer...'
    : `What you think ${answerer.name} will say...`;

  const roleLabel = isSelectMode
    ? (isAnswerer
        ? `<span>🎯</span> <span>Choose your answer</span>`
        : `<span>🔍</span> <span>Guess <strong>${answerer.name}</strong>'s choice</span>`)
    : (isAnswerer
        ? `<span>🎯</span> <span>Answer about <strong>yourself</strong></span>`
        : `<span>🔍</span> <span>Guess <strong>${answerer.name}</strong>'s answer</span>`);

  const inputSection = isSelectMode
    ? renderChoices(choices, isAnswerer, answerer)
    : `
      <div class="input-wrap">
        <input type="text" id="answerInput" placeholder="${placeholderText}"
          maxlength="100" autofocus autocomplete="off" />
      </div>
      <button class="btn btn-primary btn-full" id="submitBtn">
        Submit ✓
      </button>`;

  app.innerHTML = `
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="page">
      <div class="card card-wide">

        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="role-strip">
            ${roleLabel}
          </div>
          <div class="badge badge-purple">${questionIndex + 1} / ${total}</div>
        </div>

        ${isSelectMode ? `<div class="badge" style="margin-top:8px;background:rgba(16,185,129,0.15);color:#10b981;font-size:0.75rem;border-radius:12px;padding:4px 10px;display:inline-block">🔘 Select Answer Mode — Auto checked!</div>` : ''}

        <!-- Timer -->
        <div id="timerWrap" class="mt-16">
          ${GameTimer.render(timePerQuestion, timePerQuestion)}
        </div>

        <!-- Question card -->
        <div class="question-card mt-12">
          <div class="question-number">Question ${questionIndex + 1} of ${total}</div>
          <div class="question-text-en">${myQuestionEn}</div>
          <div class="question-text-ar">${myQuestionAr}</div>
        </div>

        <!-- Answer section -->
        <div id="gameContent" class="mt-20">
          ${inputSection}
          <div id="waitingMsg" style="display:none">
            <div class="waiting-pulse mt-12">
              <div class="dot"></div><div class="dot"></div><div class="dot"></div>
              <span id="waitingText">Waiting for your partner...</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  if (!isSelectMode) {
    // Question mode — text input
    const input = document.getElementById('answerInput');
    const btn   = document.getElementById('submitBtn');

    const submit = () => {
      const val = input?.value.trim();
      if (!val) { showToast('Please type your answer!'); return; }
      btn.disabled = true;
      btn.textContent = 'Submitted ✓';
      input.disabled = true;
      document.getElementById('waitingMsg').style.display = 'block';
      window.game.submitAnswer(questionIndex, val);
    };

    btn.addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  } else {
    // Select mode — choice buttons
    setupChoiceButtons(questionIndex, choices);
  }

  startGameTimer(state);
}

// ─── Select mode helpers ──────────────────────────────────────────────

function renderChoices(choices, isAnswerer, answerer) {
  if (!choices || choices.length === 0) {
    return `<div class="text-muted text-center">No choices available</div>`;
  }
  return `
    <div class="choices-grid" id="choicesGrid">
      ${choices.map((c, i) => `
        <button class="choice-btn" data-idx="${i}" data-val="${escapeHtml(c)}">
          <span class="choice-letter">${String.fromCharCode(65 + i)}</span>
          <span class="choice-text">${c}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setupChoiceButtons(questionIndex, choices) {
  const grid = document.getElementById('choicesGrid');
  if (!grid) return;
  let selected = false;

  grid.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (selected) return;
      selected = true;

      // Visual selection
      grid.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // Disable all
      grid.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

      const val = btn.dataset.val;
      document.getElementById('waitingMsg').style.display = 'block';
      window.game.submitAnswer(questionIndex, val);
      showToast('✓ Answer locked in!');
    });
  });
}

// ─── Timer ──────────────────────────────────────────────────────────

function startGameTimer(state) {
  if (activeTimer) activeTimer.stop();

  const { timePerQuestion, questionIndex } = state;
  const timerEl = document.getElementById('timerWrap');

  activeTimer = new GameTimer(
    timePerQuestion,
    (remaining, total) => GameTimer.update(timerEl, remaining, total),
    () => {
      if (state.gameMode === 'select') {
        const grid = document.getElementById('choicesGrid');
        if (grid) grid.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
      } else {
        const btn   = document.getElementById('submitBtn');
        const input = document.getElementById('answerInput');
        if (btn && !btn.disabled) {
          btn.disabled = true;
          input && (input.disabled = true);
        }
      }
      document.getElementById('waitingMsg').style.display = 'block';
      document.getElementById('waitingText').textContent = "Time's up! Waiting for partner...";
      window.game.timerExpiredSimul(questionIndex);
    }
  );
  activeTimer.start();
}

// ─── Partner answered first ──────────────────────────────────────────

function onOneAnswered(data, myId) {
  const { byId } = data;
  if (byId !== myId) {
    const wt = document.getElementById('waitingText');
    if (wt) wt.textContent = 'Partner answered! Waiting for you...';
    showToast('⚡ Your partner already answered!');
  }
}

// ─── Reveal (Question Mode) ──────────────────────────────────────────

function renderReveal(data, myId, answererId, isLastQuestion, isHost) {
  if (activeTimer) activeTimer.stop();

  // If select mode, use special reveal
  const gameMode = window.game.state.gameMode || 'question';
  if (gameMode === 'select') {
    renderSelectReveal(data, myId, answererId, isLastQuestion, isHost);
    return;
  }

  const { questionIndex, answererAnswer, guesserAnswer, autoCorrect, similarity, timedOut } = data;
  const isAnswerer = answererId === myId;

  const content = document.getElementById('gameContent');
  if (!content) return;

  content.innerHTML = `
    <div>
      <div class="similarity-wrap mt-4">
        <div class="similarity-label">Match score: <strong>${similarity}%</strong></div>
        <div class="similarity-track">
          <div class="similarity-fill" id="simFill" style="width:0%"></div>
        </div>
      </div>

      <div class="reveal-grid mt-12">
        <div class="reveal-box" id="answererBox">
          <div class="reveal-label">Their Real Answer</div>
          <div class="reveal-answer">${answererAnswer}</div>
        </div>
        <div class="reveal-box" id="guesserBox">
          <div class="reveal-label">The Guess</div>
          <div class="reveal-answer">${guesserAnswer}</div>
        </div>
      </div>

      <div id="autoResult" class="text-center mt-12">
        <div class="badge ${autoCorrect ? 'badge-green' : 'badge-pink'}" style="font-size:0.9rem;padding:8px 18px">
          ${autoCorrect ? '✓ Counted as Correct' : '✗ Counted as Wrong'}
        </div>
        ${timedOut ? '<div class="text-xs text-muted mt-8">Time ran out!</div>' : ''}
      </div>

      ${isAnswerer ? `
        <div class="mt-16">
          <p class="text-sm text-muted text-center">You decide — is this a fair match?</p>
          <div class="override-row mt-8">
            <button class="btn btn-success" id="markCorrect">✓ Mark Correct</button>
            <button class="btn btn-danger"  id="markWrong">✗ Mark Wrong</button>
          </div>
        </div>
      ` : `
        <div class="waiting-pulse mt-16">
          <div class="dot"></div><div class="dot"></div><div class="dot"></div>
          <span id="waitFinalCall">Waiting for final call...</span>
        </div>
      `}

      <div id="nextBtnWrap" style="display:none" class="mt-16">
        <button class="btn btn-primary btn-full" id="nextBtn">
          ${isLastQuestion ? 'See Results 🎉' : 'Next Question →'}
        </button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const fill = document.getElementById('simFill');
    if (fill) fill.style.width = similarity + '%';
    colorBoxes(autoCorrect);
  }, 50);

  if (isAnswerer) {
    let decided = false;
    const doOverride = (isCorrect) => {
      if (decided) return;
      decided = true;
      document.getElementById('markCorrect').disabled = true;
      document.getElementById('markWrong').disabled = true;

      const resultEl = document.getElementById('autoResult');
      if (resultEl) resultEl.innerHTML = `
        <div class="badge ${isCorrect ? 'badge-green' : 'badge-pink'}" style="font-size:0.9rem;padding:8px 18px">
          ${isCorrect ? '✓ Marked Correct' : '✗ Marked Wrong'}
        </div>`;

      colorBoxes(isCorrect);
      window.game.overrideCorrectness(questionIndex, isCorrect);
      if (isHost) showNextButton(isLastQuestion);
    };
    document.getElementById('markCorrect')?.addEventListener('click', () => doOverride(true));
    document.getElementById('markWrong')?.addEventListener('click',   () => doOverride(false));
  }
}

// ─── Reveal (Select Mode) ────────────────────────────────────────────

function renderSelectReveal(data, myId, answererId, isLastQuestion, isHost) {
  const { questionIndex, answererAnswer, guesserAnswer, isCorrect, timedOut, choices, correctAnswer } = data;
  const isAnswerer = answererId === myId;

  const content = document.getElementById('gameContent');
  if (!content) return;

  // Re-render choices with result highlights
  const choiceButtons = (choices || []).map((c, i) => {
    const isCorrectChoice = c === correctAnswer;
    const isAnswererPick = c === answererAnswer;
    const isGuesserPick = c === guesserAnswer;

    let cls = 'choice-btn reveal-choice';
    let badge = '';
    if (isCorrectChoice) { cls += ' choice-correct'; badge = '<span class="choice-badge correct-badge">✓ Correct Answer</span>'; }
    if (isAnswererPick && !isAnswerer) { badge += '<span class="choice-badge answerer-badge">🎯 Their pick</span>'; }
    if (isGuesserPick && isAnswerer) { badge += '<span class="choice-badge guesser-badge">🔍 Guess</span>'; }
    if (isAnswererPick && isAnswerer) { badge += '<span class="choice-badge my-badge">👤 Your pick</span>'; }
    if (isGuesserPick && !isAnswerer) { badge += '<span class="choice-badge my-badge">👤 Your pick</span>'; }

    return `
      <button class="${cls}" disabled>
        <span class="choice-letter">${String.fromCharCode(65 + i)}</span>
        <span class="choice-text">${c}</span>
        ${badge}
      </button>`;
  }).join('');

  content.innerHTML = `
    <div>
      <div class="reveal-result-banner ${isCorrect ? 'banner-correct' : 'banner-wrong'} mt-4">
        ${isCorrect
          ? '🎉 Correct! The guess matched!'
          : '❌ Wrong! The guess missed!'}
        ${timedOut ? '<div style="font-size:0.8rem;opacity:0.8;margin-top:4px">Time ran out!</div>' : ''}
      </div>

      <div class="reveal-answers-row mt-12">
        <div class="reveal-mini-box">
          <div class="reveal-label">🎯 ${isAnswerer ? 'Your Answer' : answererAnswer.split(' ')[0] + '\'s Answer'}</div>
          <div class="reveal-answer" style="font-size:0.85rem">${answererAnswer}</div>
        </div>
        <div class="reveal-mini-box">
          <div class="reveal-label">🔍 ${isAnswerer ? 'Partner\'s Guess' : 'Your Guess'}</div>
          <div class="reveal-answer" style="font-size:0.85rem">${guesserAnswer}</div>
        </div>
      </div>

      <div class="choices-grid mt-12" style="pointer-events:none">
        ${choiceButtons}
      </div>

      <div id="nextBtnWrap" style="display:none" class="mt-16">
        <button class="btn btn-primary btn-full" id="nextBtn">
          ${isLastQuestion ? 'See Results 🎉' : 'Next Question →'}
        </button>
      </div>
    </div>
  `;

  // In select mode, auto-advance or show next for host
  if (isHost) {
    setTimeout(() => showNextButton(isLastQuestion), 1200);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────

function colorBoxes(isCorrect) {
  const aBox = document.getElementById('answererBox');
  const gBox = document.getElementById('guesserBox');
  aBox?.classList.remove('correct-box', 'wrong-box');
  gBox?.classList.remove('correct-box', 'wrong-box');
  const cls = isCorrect ? 'correct-box' : 'wrong-box';
  aBox?.classList.add(cls);
  gBox?.classList.add(cls);
}

function showNextButton(isLastQuestion) {
  const wrap = document.getElementById('nextBtnWrap');
  if (!wrap) return;
  wrap.style.display = 'block';
  document.getElementById('nextBtn')?.addEventListener('click', () => {
    window.game.nextQuestion();
  });
}

function updateRevealCorrectness(isCorrect) {
  const resultEl = document.getElementById('autoResult');
  if (resultEl) resultEl.innerHTML = `
    <div class="badge ${isCorrect ? 'badge-green' : 'badge-pink'}" style="font-size:0.9rem;padding:8px 18px">
      ${isCorrect ? '✓ Final: Correct!' : '✗ Final: Wrong!'}
    </div>`;
  colorBoxes(isCorrect);

  const wait = document.getElementById('waitFinalCall');
  if (wait) wait.textContent = 'Decision made! Next question coming...';
}
