const { v4: uuidv4 } = require('uuid');

const rooms = new Map();

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function roomHandler(io, socket) {
  // Create a new room
  socket.on('create-room', ({ playerName }) => {
    const roomCode = generateRoomCode();
    const playerId = socket.id;

    const room = {
      code: roomCode,
      players: [
        { id: playerId, name: playerName, isHost: true, ready: false }
      ],
      settings: null,
      gameState: 'lobby',
    };

    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.roomCode = roomCode;

    socket.emit('room-created', {
      roomCode,
      playerId,
      player: room.players[0]
    });

    console.log(`Room ${roomCode} created by ${playerName}`);
  });

  // Join an existing room
  socket.on('join-room', ({ roomCode, playerName }) => {
    const room = rooms.get(roomCode.toUpperCase());

    if (!room) {
      socket.emit('error', { message: 'Room not found. Check the code and try again.' });
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('error', { message: 'Room is full! Only 2 players allowed.' });
      return;
    }

    if (room.gameState !== 'lobby') {
      socket.emit('error', { message: 'Game already in progress.' });
      return;
    }

    const playerId = socket.id;
    const newPlayer = { id: playerId, name: playerName, isHost: false, ready: false };
    room.players.push(newPlayer);

    socket.join(roomCode.toUpperCase());
    socket.roomCode = roomCode.toUpperCase();

    socket.emit('room-joined', {
      roomCode: roomCode.toUpperCase(),
      playerId,
      player: newPlayer,
      players: room.players
    });

    io.to(roomCode.toUpperCase()).emit('player-joined', {
      players: room.players
    });

    console.log(`${playerName} joined room ${roomCode}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const roomCode = socket.roomCode;
    if (!roomCode) return;

    const room = rooms.get(roomCode);
    if (!room) return;

    room.players = room.players.filter(p => p.id !== socket.id);

    if (room.players.length === 0) {
      rooms.delete(roomCode);
      console.log(`Room ${roomCode} deleted (empty)`);
    } else {
      // Promote remaining player to host
      room.players[0].isHost = true;
      room.gameState = 'lobby';
      io.to(roomCode).emit('player-left', {
        players: room.players,
        message: 'Your partner left the game.'
      });
    }
  });
}

module.exports = { roomHandler, rooms };
