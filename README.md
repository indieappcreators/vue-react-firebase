# React + Firebase Boilerplate

A minimal React 19 + Firebase boilerplate with authentication and emulator support.

## Features

- React 19 with Hooks
- Firebase 10 with Authentication
- Email Link Authentication
- Firebase Emulators for local development
- TypeScript support
- React Router for navigation

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development:
```bash
npm run dev:full
```

Your app will be available at:
- React App: http://localhost:5173
- Firebase Emulator UI: http://localhost:4000

## Available Scripts

- `npm run dev` - Start React development server
- `npm run dev:firebase` - Start Firebase emulators
- `npm run dev:full` - Start both React and Firebase
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # React components
├── firebase/           # Firebase configuration and types
├── App.tsx             # Main app component with routing
└── main.tsx            # App entry point
```

## Authentication

Uses Email Link Authentication (magic links):
1. User enters email on login page
2. Firebase sends a sign-in link to their email
3. User clicks the link to sign in automatically

## Development

The project automatically connects to Firebase emulators in development mode.
