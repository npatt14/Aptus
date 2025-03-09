import React from "react";
import ShiftInput from "./components/ShiftInput";
import ShiftList from "./components/ShiftList";
import ShiftConfirmation from "./components/ShiftConfirmation";
import ErrorMessage from "./components/ErrorMessage";
import { useShifts } from "./context/ShiftContext";

const App: React.FC = () => {
  const { error, submissionSuccess, clearSubmissionStatus } = useShifts();

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      <header className="pt-8 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-dark-accent mb-2">
            AI Healthcare Shift Scheduler
          </h1>
          <p className="text-dark-muted">
            Enter shift details in natural language and our AI will schedule it
            for you.
          </p>
        </div>
      </header>

      <main className="px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <ShiftInput />

          {submissionSuccess && (
            <ShiftConfirmation onDismiss={clearSubmissionStatus} />
          )}

          {error && !submissionSuccess && <ErrorMessage message={error} />}

          <ShiftList />
        </div>
      </main>

      <footer className="py-6 bg-dark-card text-dark-muted text-center text-sm">
        <div className="max-w-4xl mx-auto px-4">
          <p>
            AI Healthcare Shift Scheduler • Powered by OpenAI and Supabase •{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
