import React, { useState } from "react";
import ShiftInput from "./components/ShiftInput";
import ShiftConfirmation from "./components/ShiftConfirmation";
import ErrorMessage from "./components/ErrorMessage";
import ShiftList from "./components/ShiftList";

interface Shift {
  id: string;
  position: string;
  start_time: string;
  end_time: string;
  rate: string;
  raw_input: string;
  status: string;
  created_at: string;
}

const App: React.FC = () => {
  const [submittedShift, setSubmittedShift] = useState<Shift | null>(null);
  const [error, setError] = useState<boolean>(false);

  const handleShiftSubmitted = (shift: Shift) => {
    setSubmittedShift(shift);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setSubmittedShift(null);
  };

  const handleReset = () => {
    setSubmittedShift(null);
    setError(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Healthcare Shift Scheduler
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          {!submittedShift && !error && (
            <ShiftInput
              onShiftSubmitted={handleShiftSubmitted}
              onError={handleError}
            />
          )}

          {submittedShift && (
            <>
              <ShiftConfirmation shift={submittedShift} />
              <button
                onClick={handleReset}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Schedule Another Shift
              </button>
            </>
          )}

          {error && (
            <>
              <ErrorMessage />
              <button
                onClick={handleReset}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </>
          )}

          <ShiftList />
        </div>
      </main>

      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            AI Healthcare Shift Scheduler &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
