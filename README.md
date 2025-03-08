# Healthcare Shift Scheduler

## Setup

1. Clone this repo

   ```
   git clone <repo-url>
   cd shift-scheduler
   ```

2. Set up the backend

   ```
   cd backend
   npm install
   cp .env.example .env  # Don't forget to add your API keys
   ```

3. Set up the frontend
   ```
   cd ../frontend
   npm install
   ```

## Running the app

You'll need two terminal windows:

**Terminal 1 (Backend)**

```
cd backend
npm run dev
```

**Terminal 2 (Frontend)**

```
cd frontend
npm start
```

The app should open in your browser at http://localhost:3000.

## How to use

Just type natural language like "Need a parmacist next Monday from 9am to 5pm" in the form and hit submit.

## Running tests

```
cd backend && npm test
cd frontend && npm test
```
