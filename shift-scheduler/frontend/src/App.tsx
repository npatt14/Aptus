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

interface ApiResponse {
  shift: Shift;
  evaluation?: {
    valid: boolean;
    results: {
      requiredFields: boolean;
      dateFormats: boolean;
      timeSequence: boolean;
      position: boolean;
    };
  };
}

const App: React.FC = () => {
  const [submittedShift, setSubmittedShift] = useState<ApiResponse | null>(
    null
  );
  const [error, setError] = useState<boolean>(false);
  const [shiftAdded, setShiftAdded] = useState<number>(0);

  const handleShiftSubmitted = (response: ApiResponse) => {
    setSubmittedShift(response);
    setError(false);
    setShiftAdded((prev) => prev + 1);
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
    <div className="min-h-screen bg-dark-bg text-dark-text">
      <header className="bg-dark-card border-b border-dark-border shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-darkblue-300">
            Shift Scheduler
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          {!submittedShift && !error && (
            <ShiftInput
              onShiftSubmitted={handleShiftSubmitted}
              onError={handleError}
            />
          )}

          {submittedShift && (
            <>
              <ShiftConfirmation shift={submittedShift.shift} />
              <button
                onClick={handleReset}
                className="mt-6 bg-darkblue-600 hover:bg-darkblue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-darkblue-500 focus:ring-offset-2 focus:ring-offset-dark-bg transition-colors duration-200"
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
                className="mt-6 bg-darkblue-600 hover:bg-darkblue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-darkblue-500 focus:ring-offset-2 focus:ring-offset-dark-bg transition-colors duration-200"
              >
                Try Again
              </button>
            </>
          )}

          <ShiftList refreshTrigger={shiftAdded} />
        </div>
      </main>

      <footer className="bg-dark-card mt-12 py-6 border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-dark-muted text-sm">
            Shift Scheduler &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
