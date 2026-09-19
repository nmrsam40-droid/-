# ALHAYAT Company App

This is a Next.js application for the ALHAYAT Company investment system.

## Features
- Home page with company identity and package sections
- Static company content and responsive design
- Registration and login flow
- Subscription, withdrawal, and renewal requests
- Admin dashboard and role-based access
- Telegram backend integration using environment variables only
- SQLite database for central data storage

## Scripts
- npm install
- npm run dev
- npm run build
- npm run test

## Security
- Store Telegram token and secrets in `.env` only
- Never expose the token in frontend code
- Use server-side API routes for admin and Telegram actions
