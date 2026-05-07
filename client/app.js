// ─── Global toast ───────────────────────────────────────────────────
let toastTimeout = null;
function showToast(msg) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  clearTimeout(toastTimeout);
  toast.classList.add('show');
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Game state ──────────────────────────────────────────────────────
const socket = io();

window.game = {
  state: {
    roomCode: null,
    myId: null,
    players: [],
    isHost: false,
    questions: [],
    settings: null,
    answerer: null,
    guesser: null,
    currentQuestionIndex: 0,
    phase: 'answering',
    previousSettings: null,
    gameMode: 'question',
  },

  // ── Room actions ──
  createRoom(playerName) {
    socket.emit('create-room', { playerName });
  },

  joinRoom(playerName, roomCode) {
    socket.emit('join-room', { roomCode, playerName });
  },

  startGame({ questionCount, timePerQuestion, answererIndex, gameMode }) {
    socket.emit('start-game', { questionCount, timePerQuestion, answererIndex, gameMode });
  },

  // ── Game actions ──
  submitAnswer(questionIndex, answer) {
    socket.emit('submit-answer', { questionIndex, answer });
  },

  overrideCorrectness(questionIndex, isCorrect) {
    socket.emit('override-correctness', { questionIndex, isCorrect });
  },

  nextQuestion() {
    socket.emit('next-question');
  },

  timerExpiredSimul(questionIndex) {
    socket.emit('timer-expired', { questionIndex });
  },

  restartGame(flipRoles) {
    socket.emit('restart-game', { flipRoles });
  },
};

// ─── Socket events ───────────────────────────────────────────────────

socket.on('connect', () => {
  window.game.state.myId = socket.id;
});

// Room created (host)
socket.on('room-created', ({ roomCode, playerId, player }) => {
  const s = window.game.state;
  s.roomCode = roomCode;
  s.myId = playerId;
  s.players = [player];
  s.isHost = true;
  renderRoom({ ...s });
});

// Room joined (guest)
socket.on('room-joined', ({ roomCode, playerId, player, players }) => {
  const s = window.game.state;
  s.roomCode = roomCode;
  s.myId = playerId;
  s.players = players;
  s.isHost = false;
  renderRoom({ ...s });
});

// Another player joined
socket.on('player-joined', ({ players }) => {
  const s = window.game.state;
  s.players = players;
  renderRoom({ ...s });
  showToast('🎉 Your partner joined!');
});

// Partner left
socket.on('player-left', ({ players, message }) => {
  const s = window.game.state;
  s.players = players;
  if (players.length > 0) {
    s.isHost = players[0].id === s.myId;
    s.previousSettings = s.settings;
    renderRoom({ ...s });
  }
  showToast('😔 ' + message);
});

// Game started
socket.on('game-started', ({ questions, settings, answerer, guesser, players, gameMode }) => {
  const s = window.game.state;
  s.questions = questions;
  s.settings = settings;
  s.answerer = answerer;
  s.guesser = guesser;
  s.players = players;
  s.currentQuestionIndex = 0;
  s.phase = 'answering';
  s.gameMode = gameMode || 'question';
});

// New question — both players see it and answer simultaneously
socket.on('new-question', ({ question, questionIndex, total, answerer, guesser, timePerQuestion, gameMode }) => {
  const s = window.game.state;
  s.currentQuestionIndex = questionIndex;
  s.phase = 'answering';
  s.answerer = answerer;
  s.guesser = guesser;
  if (gameMode) s.gameMode = gameMode;

  renderGame({
    question,
    questionIndex,
    total,
    answerer,
    guesser,
    myId: s.myId,
    timePerQuestion,
    gameMode: s.gameMode || 'question',
    choices: question.choices || [],
  });
});

// One player answered — notify the other
socket.on('one-answered', (data) => {
  const s = window.game.state;
  onOneAnswered(data, s.myId);
});

// Both answers revealed
socket.on('reveal-answers', (data) => {
  const s = window.game.state;
  s.phase = 'reveal';
  const isLastQuestion = data.questionIndex >= s.questions.length - 1;
  renderReveal(data, s.myId, s.answerer.id, isLastQuestion, s.isHost);
});

// Answerer overrides correctness
socket.on('correctness-overridden', ({ questionIndex, isCorrect }) => {
  const s = window.game.state;
  if (s.answerer.id !== s.myId) {
    updateRevealCorrectness(isCorrect);
  }
});

// Game over
socket.on('game-over', (data) => {
  const s = window.game.state;
  renderResult(data, s.myId, s.isHost);
});

// Game reset
socket.on('game-reset', ({ players, previousSettings, flippedRoles }) => {
  const s = window.game.state;
  s.players = players;
  s.previousSettings = previousSettings;
  s.questions = [];
  s.phase = 'answering';
  s.isHost = players[0].id === s.myId;
  renderRoom({ ...s });
  if (flippedRoles) showToast('🔄 Roles flipped!');
});

// Errors
socket.on('error', ({ message }) => {
  showToast('⚠️ ' + message);
});

// ─── Boot ────────────────────────────────────────────────────────────
renderHome();