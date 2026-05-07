// Room / Lobby page
function renderRoom(state) {
  const { roomCode, players, isHost, myId, previousSettings } = state;
  const me = players.find(p => p.id === myId);
  const partner = players.find(p => p.id !== myId);
  const bothConnected = players.length >= 2;

  const defaultQCount = previousSettings?.questionCount || 10;
  const defaultTime = previousSettings?.timePerQuestion || 20;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="page">
      <div class="card card-wide">
        <div class="flex items-center justify-between">
          <h2>Lobby</h2>
          <span class="badge badge-${bothConnected ? 'green' : 'yellow'}">
            ${bothConnected ? '● Ready' : '◌ Waiting'}
          </span>
        </div>

        <div class="mt-16">
          <div class="label">Room Code — click to copy</div>
          <div class="room-code-box mt-8" id="codeCopyBtn">
            <div class="room-code-display">${roomCode}</div>
            <div class="copy-hint">Tap to copy · Share with your friend</div>
          </div>
        </div>

        <div class="players-row mt-20">
          <div class="player-slot ${me ? 'filled' : 'empty'}">
            <div class="player-avatar">${me ? '😎' : '?'}</div>
            <div class="player-name">${me?.name || 'You'}</div>
            <div class="text-xs text-muted mt-4">${me?.isHost ? 'Host' : 'Player 2'}</div>
          </div>

          <div style="display:flex;align-items:center;color:var(--text-dim);font-size:1.5rem">vs</div>

          <div class="player-slot ${partner ? 'filled' : 'empty'}">
            <div class="player-avatar">${partner ? '🫂' : '?'}</div>
            <div class="player-name">${partner?.name || 'Waiting...'}</div>
            <div class="text-xs text-muted mt-4">${partner ? 'Player 2' : 'Empty slot'}</div>
          </div>
        </div>

        ${isHost ? renderHostSettings(defaultQCount, defaultTime, players, myId) : renderGuestWaiting()}

        <div class="divider"></div>
        <button class="btn btn-ghost btn-full" id="leaveBtn">Leave Room</button>
      </div>
    </div>
  `;

  document.getElementById('codeCopyBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(roomCode).catch(() => {});
    showToast('Room code copied! 📋');
  });

  document.getElementById('leaveBtn').addEventListener('click', () => {
    window.location.reload();
  });

  if (isHost) {
    setupHostControls(players, myId, bothConnected);
  }
}

function renderHostSettings(defaultQCount, defaultTime, players, myId) {
  const qOptions = [10, 15, 20, 25, 30];
  const tOptions = [10, 20, 30, 40];

  return `
    <div class="divider"></div>
    <h3>Game Settings</h3>

    <div class="mt-16">
      <div class="label">🎮 Game Mode</div>
      <div style="font-size:0.8rem;color:var(--text-muted);margin-top:4px;margin-bottom:10px">
        Choose how players answer questions
      </div>
      <div style="display:flex;flex-direction:column;gap:8px" id="gameModeGroup">
        <label style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:10px;
          background:var(--surface2);border:2px solid var(--accent);cursor:pointer;transition:all 0.2s"
          class="mode-option" data-mode="question">
          <input type="radio" name="gameModeSelect" value="question" checked
            style="accent-color:var(--accent);width:16px;height:16px;margin-top:2px" />
          <div>
            <div style="font-weight:600;font-size:0.9rem">✏️ Question Mode <span style="font-size:0.75rem;color:var(--accent);background:rgba(139,92,246,0.15);padding:2px 8px;border-radius:12px;margin-left:4px">Original</span></div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:3px">Type your answer freely. Partner tries to guess.</div>
          </div>
        </label>
        <label style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:10px;
          background:var(--surface2);border:1px solid var(--border);cursor:pointer;transition:all 0.2s"
          class="mode-option" data-mode="select">
          <input type="radio" name="gameModeSelect" value="select"
            style="accent-color:var(--accent);width:16px;height:16px;margin-top:2px" />
          <div>
            <div style="font-weight:600;font-size:0.9rem">🔘 Select Answer Mode <span style="font-size:0.75rem;color:#10b981;background:rgba(16,185,129,0.15);padding:2px 8px;border-radius:12px;margin-left:4px">New!</span></div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:3px">Choose from 4 options. Instant automatic result!</div>
          </div>
        </label>
      </div>
    </div>

    <div class="mt-16">
      <div class="label">Number of Questions</div>
      <div class="chip-group mt-8" id="qCountGroup">
        ${qOptions.map(n => `
          <div class="chip ${n === defaultQCount ? 'selected' : ''}" data-val="${n}">${n}</div>
        `).join('')}
      </div>
    </div>

    <div class="mt-16">
      <div class="label">Time Per Question</div>
      <div class="chip-group mt-8" id="timeGroup">
        ${tOptions.map(t => `
          <div class="chip ${t === defaultTime ? 'selected' : ''}" data-val="${t}">${t}s</div>
        `).join('')}
      </div>
    </div>

    <div class="mt-20">
      <div class="label">Who answers about themselves?</div>
      <div style="font-size:0.8rem;color:var(--text-muted);margin-top:4px;margin-bottom:10px">
        This person answers questions about themselves. Their partner tries to guess!
      </div>
      <div id="roleGroup" style="display:flex;flex-direction:column;gap:8px">
        ${players.map((p, i) => `
          <label style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:8px;
            background:var(--surface2);border:1px solid var(--border);cursor:pointer;transition:all 0.2s"
            class="role-option" data-idx="${i}">
            <input type="radio" name="roleSelect" value="${i}" ${i === 0 ? 'checked' : ''}
              style="accent-color:var(--accent);width:16px;height:16px" />
            <div>
              <div style="font-weight:600;font-size:0.9rem">${p.name} <span style="color:var(--text-muted);font-weight:400">${p.id === myId ? '(You)' : ''}</span></div>
              <div style="font-size:0.75rem;color:var(--text-muted)">Answers about themselves</div>
            </div>
          </label>
        `).join('')}
      </div>
    </div>

    <button class="btn btn-primary btn-full mt-20" id="startGameBtn" disabled>
      Waiting for partner...
    </button>
  `;
}

function renderGuestWaiting() {
  return `
    <div class="divider"></div>
    <div class="waiting-pulse">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <span style="margin-left:4px">Waiting for host to start the game...</span>
    </div>
  `;
}

function setupHostControls(players, myId, bothConnected) {
  // Chip groups
  function makeChipGroup(groupId) {
    const chips = document.querySelectorAll(`#${groupId} .chip`);
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
      });
    });
  }
  makeChipGroup('qCountGroup');
  makeChipGroup('timeGroup');

  // Mode selection visual feedback
  const modeLabels = document.querySelectorAll('.mode-option');
  const modeRadios = document.querySelectorAll('input[name="gameModeSelect"]');
  modeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      modeLabels.forEach(lbl => {
        const isSelected = lbl.querySelector('input').checked;
        lbl.style.borderColor = isSelected ? 'var(--accent)' : 'var(--border)';
        lbl.style.borderWidth = isSelected ? '2px' : '1px';
      });
    });
  });

  // Start button
  const startBtn = document.getElementById('startGameBtn');
  if (bothConnected && startBtn) {
    startBtn.disabled = false;
    startBtn.textContent = '▶  Start Game';
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const qCount = parseInt(document.querySelector('#qCountGroup .chip.selected')?.dataset.val || 10);
      const time = parseInt(document.querySelector('#timeGroup .chip.selected')?.dataset.val || 20);
      const roleRadio = document.querySelector('input[name="roleSelect"]:checked');
      const answererIndex = roleRadio ? parseInt(roleRadio.value) : 0;
      const modeRadio = document.querySelector('input[name="gameModeSelect"]:checked');
      const gameMode = modeRadio ? modeRadio.value : 'question';

      window.game.startGame({ questionCount: qCount, timePerQuestion: time, answererIndex, gameMode });
    });
  }
}

// Called when a second player joins
function updateRoomPlayers(players, myId, isHost) {
  renderRoom({ ...window.game.state, players, isHost, myId });
}
