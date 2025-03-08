import React, { useState } from "react";
import { postShift } from "../api/shiftAPI";

interface ShiftInputProps {
  onShiftSubmitted: (data: any) => void;
  onError: (error: any) => void;
}

const ShiftInput: React.FC<ShiftInputProps> = ({
  onShiftSubmitted,
  onError,
}) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    setIsLoading(true);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const result = await postShift(input, timezone);

      onShiftSubmitted(result);
      setInput("");
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-dark-card p-6 rounded-lg shadow-lg border border-dark-border">
      <h2 className="text-2xl font-bold text-darkblue-300 mb-6">
        Enter Shift Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="shift-input"
            className="block text-dark-text font-medium mb-2"
          >
            Describe your shift in natural language
          </label>
          <textarea
            id="shift-input"
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-darkblue-500 focus:border-transparent min-h-[120px] text-dark-text placeholder-dark-muted transition-colors"
            placeholder="Example: Need a nurse for tomorrow from 9am to 5pm at $25/hour"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-darkblue-600 hover:bg-darkblue-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-darkblue-500 focus:ring-offset-2 focus:ring-offset-dark-card disabled:opacity-50 transition-colors duration-200"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? "Processing..." : "Schedule Shift"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShiftInput;
