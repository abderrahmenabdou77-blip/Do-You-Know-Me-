// ScoreBoard component
function renderScoreBoard(score, total) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const r = 60;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  const color = pct >= 75 ? '#c8f542' : pct >= 50 ? '#7b61ff' : '#ff6b9d';

  let label = '';
  if (pct >= 90) label = 'Soulmates 💖';
  else if (pct >= 75) label = 'Best Friends 🌟';
  else if (pct >= 60) label = 'Good Friends 😊';
  else if (pct >= 40) label = 'Getting There 🤝';
  else label = 'Still Learning 🌱';

  return `
    <div class="score-hero">
      <div class="score-ring">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle cx="75" cy="75" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="10"/>
          <circle cx="75" cy="75" r="${r}" fill="none" stroke="${color}" stroke-width="10"
            stroke-dasharray="${dash} ${circ}" stroke-linecap="round"
            style="transition: stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)"/>
        </svg>
        <div class="score-ring-text">
          <div class="score-pct">${pct}%</div>
          <div class="score-label">${score}/${total}</div>
        </div>
      </div>
      <div class="compatibility-label">${label}</div>
    </div>
  `;
}
