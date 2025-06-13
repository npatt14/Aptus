# Healthcare Shift Scheduler

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/yourusername/healthcare-hiring)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

An AI-powered healthcare shift scheduling application that transforms natural language inputs into structured shift data for healthcare administrators.

![Healthcare Shift Scheduler Demo](./assets/demo-screenshot.png)

## 🚀 Features

- **Natural Language Parsing** - Enter shift requirements using everyday language ("Need a nurse tomorrow from 9am to 5pm at $30/hr")
- **AI-Powered Interpretation** - Leverages GPT-4 to understand context, dates, times, roles, and compensation
- **Advanced LLM Evaluation** - Uses dual-LLM architecture to verify response accuracy and quality
- **Timezone Awareness** - Correctly handles timezone conversions for shift scheduling
- **Modern React UI** - Clean, responsive interface built with React and Tailwind CSS
- **Robust API Backend** - Node.js/Express backend with TypeScript for type safety
- **Production-Ready Testing** - Comprehensive test suite with real LLM evaluation tests

## 🔧 Technology Stack

### Frontend

- React 18
- TypeScript
- Tailwind CSS
- Context API for state management
- Axios for API communication

### Backend

- Node.js with Express
- TypeScript
- OpenAI API (GPT-4)
- Supabase (PostgreSQL)
- Jest for testing

## 📊 Advanced LLM Evaluation System

A key feature of this application is its  LLM evaluation system:

1. **Dual-LLM Architecture** - Uses a second LLM call to independently evaluate the output quality of the first LLM
2. **Comprehensive Metrics** - Evaluates position accuracy, time accuracy, rate accuracy, and overall quality
3. **Non-Mocked LLM Testing** - Real API calls verify actual model behavior in tests
4. **Production Verification** - Ensures AI responses meet quality standards before displaying to users

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- OpenAI API key
- Supabase account (free tier works fine)

### Backend Setup

1. Clone this repository

   ```bash
   git clone https://github.com/yourusername/healthcare-hiring.git
   cd healthcare-hiring/shift-scheduler
   ```

2. Set up the backend

   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

3. Add your API keys to `.env`

   ```
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

4. Set up Supabase
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Navigate to the SQL Editor in your Supabase dashboard
   - Run the SQL script in `scripts/setupSupabase.sql` to create tables

### Frontend Setup

```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

You'll need two terminal windows:

**Terminal 1 (Backend)**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend)**

```bash
cd frontend
npm start
```

The app will open at http://localhost:3000

## 🧪 Running Tests

```bash
cd backend
npm test          # Run all tests
npm run test:llm  # Run only LLM evaluation tests (requires API key)
npm run test:unit # Run unit/integration tests
```

## 📝 Key Files to Explore

- **LLM Evaluation**: `backend/src/__tests__/services/llmEvaluation.test.ts`
- **Evaluation Service**: `backend/src/services/evaluationService.ts`
- **OpenAI Service**: `backend/src/services/openAI.ts`
- **API Routes**: `backend/src/api/shiftRoutes.ts`


