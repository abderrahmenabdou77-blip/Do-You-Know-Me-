// Result page
function renderResult(data, myId, isHost) {
  const { answers, questions, score, total, percentage, compatibilityLabel, answerer, guesser } = data;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="page">
      <div class="card card-xl" style="width:100%;max-width:680px">
        <div class="text-center">
          <div class="label">Game Over</div>
          <h2 class="mt-8">${answerer.name} was the subject 🎯</h2>
          <p class="text-sm text-muted mt-4">${guesser.name} was guessing</p>
        </div>

        ${renderScoreBoard(score, total)}

        <div class="divider"></div>

        <h3>Answer Review</h3>
        <div class="answers-list mt-12">
          ${answers.map((a, i) => {
            if (!a) return '';
            const q = questions[i];
            if (!q) return '';
            return `
              <div class="answer-item ${a.isCorrect ? 'correct' : 'wrong'}">
                <div class="answer-icon">${a.isCorrect ? '✓' : '✗'}</div>
                <div>
                  <div class="answer-q">${q.en}</div>
                  <div class="answer-values">
                    <span class="answer-val">${a.answererAnswer || '—'}</span>
                    <span class="answer-sep">vs</span>
                    <span class="answer-val" style="color:var(--text-muted)">${a.guesserAnswer || '—'}</span>
                    ${a.overridden ? '<span class="badge badge-purple" style="font-size:0.65rem;padding:2px 8px">edited</span>' : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="divider"></div>

        ${isHost ? `
          <div class="result-actions">
            <button class="btn btn-primary btn-full" id="replayBtn">
              ↺ Play Again (same roles)
            </button>
            <button class="btn btn-secondary btn-full" id="flipBtn">
              ⇄ Flip Roles & Play Again
            </button>
            <button class="btn btn-ghost btn-full" id="exitBtn">
              ✕ Leave Game
            </button>
          </div>
        ` : `
          <div class="waiting-pulse" style="justify-content:center">
            <div class="dot"></div><div class="dot"></div><div class="dot"></div>
            <span>Waiting for host to decide next action...</span>
          </div>
          <button class="btn btn-ghost btn-full mt-12" id="exitBtn">✕ Leave Game</button>
        `}
      </div>
    </div>
  `;

  // Animate score ring after mount
  setTimeout(() => {
    const r = 60;
    const circ = 2 * Math.PI * r;
    const dash = (percentage / 100) * circ;
    const circle = document.querySelector('.score-ring svg circle:last-child');
    if (circle) circle.setAttribute('stroke-dasharray', `${dash} ${circ}`);
  }, 100);

  document.getElementById('exitBtn')?.addEventListener('click', () => {
    window.location.reload();
  });

  if (isHost) {
    document.getElementById('replayBtn')?.addEventListener('click', () => {
      window.game.restartGame(false);
    });
    document.getElementById('flipBtn')?.addEventListener('click', () => {
      window.game.restartGame(true);
    });
  }
}
