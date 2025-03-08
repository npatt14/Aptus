import React from "react";

interface ShiftConfirmationProps {
  shift: {
    position: string;
    start_time: string;
    end_time: string;
    rate: string;
    raw_input: string;
  };
}

const ShiftConfirmation: React.FC<ShiftConfirmationProps> = ({ shift }) => {
  // Format the dates to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    });
  };

  return (
    <div className="w-full max-w-lg bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
      <div className="flex items-center space-x-2 mb-4">
        <svg
          className="w-6 h-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800">Shift Scheduled!</h2>
      </div>

      <div className="space-y-3 mb-4">
        <p className="text-gray-700">
          <span className="font-medium">Position:</span> {shift.position}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Start Time:</span>{" "}
          {formatDate(shift.start_time)}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">End Time:</span>{" "}
          {formatDate(shift.end_time)}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Rate:</span> {shift.rate}
        </p>
      </div>

      <div className="border-t border-green-200 pt-3 mt-4">
        <p className="text-sm text-gray-500">
          <span className="font-medium">Original Request:</span> "
          {shift.raw_input}"
        </p>
      </div>
    </div>
  );
};

export default ShiftConfirmation;
