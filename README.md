# Teleparty Chat Application

A real-time chat application built with React and TypeScript, using the Teleparty WebSocket library for real-time communication.

## Features

- **Create Chat Rooms**: Users can create a new chat room with a single button click
- **Join Chat Rooms**: Users can join existing rooms by entering a room ID
- **Real-time Messaging**: Send and receive chat messages instantly
- **Nickname Support**: Set your nickname when joining or creating a room
- **Message History**: Load all previous chat messages when joining a session
- **Typing Indicators**: See when someone is typing in the chat room
- **System Messages**: View system notifications (user joined, room created, etc.)

## Tech Stack

- React 19
- TypeScript
- Vite
- teleparty-websocket-lib

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

```bash
npm run deploy
```

## Usage

1. Open the application
2. Wait for the connection to establish (green "Connected" indicator)
3. Enter your nickname
4. Either:
   - Click "Create New Room" to start a new chat room
   - Enter a Room ID and click "Join" to join an existing room
5. Start chatting!

## License

MIT
