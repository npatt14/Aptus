import React, { useEffect, useState } from "react";
import { getAllShifts } from "../api/shiftAPI";

interface Shift {
  id: string;
  position: string;
  start_time: string;
  end_time: string;
  rate: string;
  raw_input: string;
  status: "success" | "error";
  created_at: string;
}

interface ShiftListProps {
  refreshTrigger?: number; // Optional prop to trigger refresh
}

const ShiftList: React.FC<ShiftListProps> = ({ refreshTrigger = 0 }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllShifts();
        setShifts(data);
        setError(null);
      } catch (err) {
        setError("Failed to load shifts. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShifts();
  }, [refreshTrigger]);

  // Format the dates to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mt-10 p-6 bg-dark-card rounded-lg shadow-lg border border-dark-border">
        <h2 className="text-2xl font-bold text-darkblue-300 mb-4">
          Recent Shifts
        </h2>
        <div className="flex justify-center py-8">
          <div className="animate-pulse flex space-x-2 items-center">
            <div className="h-3 w-3 bg-darkblue-500 rounded-full"></div>
            <div className="h-3 w-3 bg-darkblue-500 rounded-full"></div>
            <div className="h-3 w-3 bg-darkblue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mt-10 p-6 bg-dark-card rounded-lg shadow-lg border border-dark-border">
        <h2 className="text-2xl font-bold text-darkblue-300 mb-4">
          Recent Shifts
        </h2>
        <div className="bg-red-900/10 text-red-400 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mt-10 p-6 bg-dark-card rounded-lg shadow-lg border border-dark-border">
      <h2 className="text-2xl font-bold text-darkblue-300 mb-6">
        Recent Shifts
      </h2>

      {shifts.length === 0 ? (
        <p className="text-dark-muted py-4 text-center">
          No shifts scheduled yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-dark-card">
            <thead>
              <tr className="w-full h-12 border-b border-dark-border">
                <th className="text-left pl-4 pr-2 text-dark-muted font-medium">
                  Position
                </th>
                <th className="text-left px-2 text-dark-muted font-medium">
                  Start Time
                </th>
                <th className="text-left px-2 text-dark-muted font-medium">
                  End Time
                </th>
                <th className="text-left px-2 text-dark-muted font-medium">
                  Rate
                </th>
                <th className="text-left px-2 text-dark-muted font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr
                  key={shift.id}
                  className="h-14 border-b border-dark-border hover:bg-dark-bg transition-colors"
                >
                  <td className="pl-4 pr-2">
                    {shift.status === "success" ? (
                      <span className="font-medium text-darkblue-300">
                        {shift.position}
                      </span>
                    ) : (
                      <span className="text-dark-muted italic">
                        Processing...
                      </span>
                    )}
                  </td>
                  <td className="px-2">
                    {shift.status === "success" ? (
                      <span className="text-dark-text">
                        {formatDate(shift.start_time)}
                      </span>
                    ) : (
                      <span className="text-dark-muted">-</span>
                    )}
                  </td>
                  <td className="px-2">
                    {shift.status === "success" ? (
                      <span className="text-dark-text">
                        {formatDate(shift.end_time)}
                      </span>
                    ) : (
                      <span className="text-dark-muted">-</span>
                    )}
                  </td>
                  <td className="px-2">
                    {shift.status === "success" ? (
                      <span className="text-dark-text">{shift.rate}</span>
                    ) : (
                      <span className="text-dark-muted">-</span>
                    )}
                  </td>
                  <td className="px-2">
                    {shift.status === "success" ? (
                      <span className="px-3 py-1 bg-darkblue-900/30 text-darkblue-400 rounded-full text-xs">
                        Success
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-900/20 text-red-400 rounded-full text-xs">
                        Error
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShiftList;
