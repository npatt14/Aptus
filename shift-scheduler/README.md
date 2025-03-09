# Healthcare Shift Scheduler

## Setup

1. Clone this repo
2. Set up the backend

   ```
   cd backend
   npm install
   cp .env.example .env  # Don't forget to add your API keys
   ```

3. Set up Supabase

   - Create a Supabase account at [supabase.com](https://supabase.com)
   - Create a new project
   - Get your Supabase URL and anon key from Project Settings > API
   - Add these to your `.env` file as `SUPABASE_URL` and `SUPABASE_KEY`
   - Initialize your database schema by running the SQL script:
     ```
     # Navigate to your Supabase project's SQL Editor
     # Copy and paste the contents of scripts/setupSupabase.sql
     # Run the script to create the required tables and triggers
     ```

4. Set up the frontend
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

The app should open at http://localhost:3000

## How to use

Just type natural language like "Need a parmacist next Monday from 9am to 5pm" in the form and hit submit. Feel free to have fun with testing edge cases!

## Running tests

```
cd backend && npm test
cd frontend && npm test
```
