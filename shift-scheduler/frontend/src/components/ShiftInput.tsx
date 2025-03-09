import React, { useState } from "react";
import { useShifts } from "../context/ShiftContext";

const ShiftInput: React.FC = () => {
  const [input, setInput] = useState("");
  const { submitShift, loading } = useShifts();

  // More efficient submit handler with optimistic clearing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const inputValue = input; // Capture the current value
    setInput(""); // Clear immediately for better UX

    // Process the submitted value
    await submitShift(inputValue);
  };

  return (
    <div className="w-full max-w-lg bg-dark-card p-6 rounded-lg shadow-lg mx-auto">
      <h2 className="text-xl font-semibold text-dark-accent mb-4">
        Create a New Shift
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="shift-text"
            className="block text-dark-muted text-sm font-medium mb-2"
          >
            Describe the shift you need to fill
          </label>
          <textarea
            id="shift-text"
            rows={3}
            className="w-full px-3 py-2 bg-dark-card text-dark-text border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-accent"
            placeholder="Example: Need a nurse tomorrow from 9am to 5pm at $25/hr"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-dark-accent hover:bg-dark-accent-hover text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-accent focus:ring-offset-2 focus:ring-offset-dark-bg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Schedule Shift"
          )}
        </button>
      </form>
    </div>
  );
};

export default ShiftInput;
