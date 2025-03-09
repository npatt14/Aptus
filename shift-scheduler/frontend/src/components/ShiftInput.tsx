import React, { useState } from "react";
import { useShifts } from "../context/ShiftContext";

const ShiftInput: React.FC = () => {
  const [input, setInput] = useState("");
  const { submitShift, loading } = useShifts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await submitShift(input);
    setInput("");
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
            className="w-full px-3 py-2 bg-dark-input text-dark-text border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-accent"
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
          {loading ? "Processing..." : "Schedule Shift"}
        </button>
      </form>
    </div>
  );
};

export default ShiftInput;
