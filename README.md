# 💫 Do You Know Me?

A real-time, bilingual (Arabic & English) **"Do You Know Your Friend?"** multiplayer quiz game.

## Features

- 🎮 **Real-time multiplayer** via Socket.io — 2 players per room
- 🔢 **Configurable**: 10/15/20/25/30 questions; 10s/20s/30s/40s per question
- 🎭 **Role system**: Choose who answers about themselves, who guesses
- 🧠 **Smart matching**: Flexible similarity algorithm handles typos, Arabic/English, partial matches
- ✏️ **Manual override**: The answerer can mark any guess as correct or wrong
- 📊 **Results**: Score, percentage, compatibility label, full answer review
- 🔄 **Replay options**: Same roles, flip roles, or leave
- 🌐 **Bilingual**: Interface in English, questions in both Arabic & English

## Setup

```bash
npm install
npm start
```

Open http://localhost:3000

## How to Play

1. **Player 1** enters their name → clicks **Create a Room** → shares the 6-character code
2. **Player 2** enters their name → pastes the code → clicks **Join**
3. **Host** configures:
   - Number of questions (10–30)
   - Time per question (10s–40s)
   - Who answers about themselves
4. **Game starts**: The "answerer" writes their real answer, the "guesser" tries to match it
5. After each round, answers are revealed. The **answerer** can override the auto-judgment
6. Final screen shows compatibility score and full breakdown

## Tech Stack

- **Backend**: Node.js + Express + Socket.io
- **Frontend**: Vanilla JS (no framework), CSS custom properties
- **Fonts**: Syne + DM Sans (Google Fonts)
