// Home page
function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="page">
      <div class="card" style="text-align:center">
        <div style="font-size:2.8rem;margin-bottom:16px">💫</div>
        <h1>Do You<br><span class="accent">Know Me?</span></h1>
        <p class="text-muted mt-12" style="font-size:0.95rem;max-width:320px;margin:12px auto 28px">
          The ultimate friendship & relationship quiz. Find out how well you really know each other.
        </p>

        <div class="divider"></div>

        <div class="input-wrap">
          <label>Your Name</label>
          <input type="text" id="playerName" placeholder="Enter your name..." maxlength="20" />
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
          <button class="btn btn-primary btn-full" id="createRoomBtn">
            <span>✦</span> Create a Room
          </button>

          <div style="display:flex;align-items:center;gap:10px">
            <div class="divider" style="flex:1;margin:0"></div>
            <span class="text-xs text-muted">or</span>
            <div class="divider" style="flex:1;margin:0"></div>
          </div>

          <div style="display:flex;gap:8px">
            <input type="text" id="joinCode" placeholder="Room code..." maxlength="6"
              style="text-transform:uppercase;letter-spacing:0.1em;flex:1" />
            <button class="btn btn-secondary" id="joinRoomBtn" style="padding:13px 20px">
              Join →
            </button>
          </div>
        </div>

        <p class="text-xs text-muted mt-24">
          Made with 💜 · 2 players · Bilingual 🇬🇧🇸🇦
        </p>
      </div>
    </div>
  `;

  document.getElementById('playerName').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('createRoomBtn').click();
  });

  document.getElementById('joinCode').addEventListener('input', e => {
    e.target.value = e.target.value.toUpperCase();
  });

  document.getElementById('joinCode').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('joinRoomBtn').click();
  });

  document.getElementById('createRoomBtn').addEventListener('click', () => {
    const name = document.getElementById('playerName').value.trim();
    if (!name) { showToast('Please enter your name first!'); return; }
    window.game.createRoom(name);
  });

  document.getElementById('joinRoomBtn').addEventListener('click', () => {
    const name = document.getElementById('playerName').value.trim();
    const code = document.getElementById('joinCode').value.trim();
    if (!name) { showToast('Please enter your name first!'); return; }
    if (!code || code.length < 4) { showToast('Enter a valid room code!'); return; }
    window.game.joinRoom(name, code);
  });
}
