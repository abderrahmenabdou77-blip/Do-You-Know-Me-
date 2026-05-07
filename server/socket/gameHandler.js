const { rooms } = require('./roomHandler');
const { getRandomQuestions, getChoicesForQuestion } = require('../data/questions');

function gameHandler(io, socket) {

  socket.on('start-game', ({ questionCount, timePerQuestion, answererIndex, gameMode }) => {
    const roomCode = socket.roomCode;
    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player?.isHost) return;

    if (room.players.length < 2) {
      socket.emit('error', { message: 'Need 2 players to start!' });
      return;
    }

    const mode = gameMode || 'question';
    const questions = getRandomQuestions(questionCount, mode);

    room.settings = { questionCount, timePerQuestion, answererIndex, gameMode: mode };
    room.gameState = 'playing';
    room.questions = questions;
    room.currentQuestion = 0;
    room.answers = [];
    room.answerer = room.players[answererIndex];
    room.guesser = room.players[answererIndex === 0 ? 1 : 0];
    room.gameMode = mode;

    io.to(roomCode).emit('game-started', {
      questions,
      settings: room.settings,
      answerer: room.answerer,
      guesser: room.guesser,
      players: room.players,
      gameMode: mode,
    });

    sendNextQuestion(io, room, roomCode);
  });

  socket.on('submit-answer', ({ questionIndex, answer }) => {
    const roomCode = socket.roomCode;
    const room = rooms.get(roomCode);
    if (!room) return;

    if (!room.answers[questionIndex]) room.answers[questionIndex] = {};

    const isAnswerer = room.answerer.id === socket.id;
    const isGuesser  = room.guesser.id  === socket.id;

    if (isAnswerer) room.answers[questionIndex].answererAnswer = answer;
    if (isGuesser)  room.answers[questionIndex].guesserAnswer  = answer;

    room.answers[questionIndex].questionId = room.questions[questionIndex].id;

    const a = room.answers[questionIndex];
    const bothAnswered = a.answererAnswer !== undefined && a.guesserAnswer !== undefined;

    if (bothAnswered) {
      const mode = room.gameMode || 'question';

      if (mode === 'select') {
        // In select mode: correct = guesser guessed the same as answerer
        const isCorrect = a.answererAnswer === a.guesserAnswer;
        a.autoCorrect = isCorrect;
        a.isCorrect = isCorrect;

        const q = room.questions[questionIndex];
        io.to(roomCode).emit('reveal-answers', {
          questionIndex,
          question: q,
          answererAnswer: a.answererAnswer,
          guesserAnswer:  a.guesserAnswer,
          autoCorrect: isCorrect,
          isCorrect,
          similarity: isCorrect ? 100 : 0,
          correctAnswer: a.answererAnswer,
          choices: q.choices || [],
          gameMode: 'select',
        });
      } else {
        const similarity = computeSimilarity(a.answererAnswer, a.guesserAnswer);
        const autoCorrect = similarity >= 0.6;
        a.autoCorrect = autoCorrect;
        a.isCorrect = autoCorrect;

        io.to(roomCode).emit('reveal-answers', {
          questionIndex,
          question: room.questions[questionIndex],
          answererAnswer: a.answererAnswer,
          guesserAnswer:  a.guesserAnswer,
          autoCorrect,
          similarity: Math.round(similarity * 100),
          gameMode: 'question',
        });
      }
    } else {
      io.to(roomCode).emit('one-answered', {
        questionIndex,
        byRole: isAnswerer ? 'answerer' : 'guesser',
        byId: socket.id,
      });
    }
  });

  socket.on('override-correctness', ({ questionIndex, isCorrect }) => {
    const roomCode = socket.roomCode;
    const room = rooms.get(roomCode);
    if (!room) return;
    if (room.answerer.id !== socket.id) return;

    room.answers[questionIndex].isCorrect = isCorrect;
    room.answers[questionIndex].overridden = true;

    io.to(roomCode).emit('correctness-overridden', { questionIndex, isCorrect });
  });

  socket.on('next-question', () => {
    const roomCode = socket.roomCode;
    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player?.isHost) return;

    room.currentQuestion++;
    if (room.currentQuestion >= room.questions.length) {
      endGame(io, room, roomCode);
    } else {
      sendNextQuestion(io, room, roomCode);
    }
  });

  socket.on('timer-expired', ({ questionIndex }) => {
    const roomCode = socket.roomCode;
    const room = rooms.get(roomCode);
    if (!room) return;

    if (!room.answers[questionIndex]) room.answers[questionIndex] = {};
    const a = room.answers[questionIndex];
    const mode = room.gameMode || 'question';
    const q = room.questions[questionIndex];

    if (a.answererAnswer === undefined) a.answererAnswer = '(no answer)';
    if (a.guesserAnswer  === undefined) a.guesserAnswer  = '(no answer)';
    a.autoCorrect = false;
    a.isCorrect = false;

    if (mode === 'select') {
      io.to(roomCode).emit('reveal-answers', {
        questionIndex,
        question: q,
        answererAnswer: a.answererAnswer,
        guesserAnswer:  a.guesserAnswer,
        autoCorrect: false,
        isCorrect: false,
        similarity: 0,
        timedOut: true,
        correctAnswer: a.answererAnswer,
        choices: q.choices || [],
        gameMode: 'select',
      });
    } else {
      io.to(roomCode).emit('reveal-answers', {
        questionIndex,
        question: q,
        answererAnswer: a.answererAnswer,
        guesserAnswer:  a.guesserAnswer,
        autoCorrect: false,
        similarity: 0,
        timedOut: true,
        gameMode: 'question',
      });
    }
  });

  socket.on('restart-game', ({ flipRoles }) => {
    const roomCode = socket.roomCode;
    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player?.isHost) return;

    if (flipRoles && room.settings) {
      room.settings.answererIndex = room.settings.answererIndex === 0 ? 1 : 0;
    }

    room.gameState = 'lobby';
    room.questions = null;
    room.currentQuestion = 0;
    room.answers = [];
    room.answerer = null;
    room.guesser = null;
    room.gameMode = null;

    io.to(roomCode).emit('game-reset', {
      players: room.players,
      previousSettings: room.settings,
      flippedRoles: flipRoles,
    });
  });
}

function sendNextQuestion(io, room, roomCode) {
  const q = room.questions[room.currentQuestion];
  io.to(roomCode).emit('new-question', {
    question: q,
    questionIndex: room.currentQuestion,
    total: room.questions.length,
    answerer: room.answerer,
    guesser: room.guesser,
    timePerQuestion: room.settings.timePerQuestion,
    gameMode: room.gameMode || 'question',
  });
}

function endGame(io, room, roomCode) {
  const total = room.answers.length;
  const correct = room.answers.filter(a => a?.isCorrect).length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  let compatibilityLabel = '';
  if (percentage >= 90)      compatibilityLabel = 'Soulmates 💖';
  else if (percentage >= 75) compatibilityLabel = 'Best Friends 🌟';
  else if (percentage >= 60) compatibilityLabel = 'Good Friends 😊';
  else if (percentage >= 40) compatibilityLabel = 'Getting There 🤝';
  else                       compatibilityLabel = 'Still Learning 🌱';

  room.gameState = 'results';

  io.to(roomCode).emit('game-over', {
    answers: room.answers,
    questions: room.questions,
    score: correct,
    total,
    percentage,
    compatibilityLabel,
    answerer: room.answerer,
    guesser: room.guesser,
  });
}

function computeSimilarity(a, b) {
  if (!a || !b) return 0;
  const normalize = str => str
    .toLowerCase().trim()
    .replace(/[^\w\u0600-\u06FF\s]/g, '')
    .replace(/\s+/g, ' ');

  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.85;

  const wordsA = na.split(' ').filter(Boolean);
  const wordsB = nb.split(' ').filter(Boolean);
  if (!wordsA.length || !wordsB.length) return 0;

  let matches = 0;
  for (const wa of wordsA)
    for (const wb of wordsB)
      if (wa === wb || levenshtein(wa, wb) <= Math.floor(Math.max(wa.length, wb.length) * 0.3)) {
        matches++; break;
      }

  return matches / Math.max(wordsA.length, wordsB.length);
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m+1 }, (_, i) =>
    Array.from({ length: n+1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

module.exports = { gameHandler };
