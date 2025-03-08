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
    <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Enter Shift Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="shift-input"
            className="block text-gray-700 font-medium mb-2"
          >
            Describe your shift in natural language
          </label>
          <textarea
            id="shift-input"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="Example: Need a nurse for tomorrow from 9am to 5pm at $25/hour"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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
