import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { useShifts } from "../context/ShiftContext";

const ShiftList: React.FC = () => {
  const { shifts, loading, error, refreshShifts } = useShifts();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load shifts when the component mounts
  useEffect(() => {
    refreshShifts();
  }, [refreshShifts]);

  // Handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await refreshShifts();
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500); // Add a small delay to prevent UI jank
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      console.error("Date parsing error:", error);
      return "Invalid date";
    }
  };

  if (loading && shifts.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-dark-card p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-dark-accent mb-4">
          Scheduled Shifts
        </h2>
        <div className="animate-pulse flex justify-center py-8">
          <div className="text-dark-muted">Loading shifts...</div>
        </div>
      </div>
    );
  }

  if (error && shifts.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-dark-card p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-dark-accent mb-4">
          Scheduled Shifts
        </h2>
        <div className="text-red-400 text-center py-8">
          Error loading shifts: {error}
        </div>
        <button
          className="mt-2 px-4 py-2 bg-dark-accent text-white rounded-md mx-auto block"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Trying..." : "Try Again"}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-dark-card p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-dark-accent">
          Scheduled Shifts
        </h2>
        <button
          className="px-3 py-1 text-sm bg-dark-accent text-white rounded-md flex items-center"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {shifts.length === 0 ? (
        <div className="text-dark-muted text-center py-8">
          No shifts scheduled yet. Use the form above to schedule a shift.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-border">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-dark-muted uppercase tracking-wider">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-dark-muted uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-dark-muted uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-dark-muted uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-dark-muted uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {shifts.map((shift) => (
                <tr key={shift.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-dark-text">
                    {shift.position}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-dark-text">
                    {formatDate(shift.start_time)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-dark-text">
                    {formatDate(shift.end_time)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-dark-text">
                    {shift.rate}
                  </td>
                  <td
                    className={`px-4 py-4 whitespace-nowrap ${
                      shift.status === "success"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {shift.status === "success" ? "Confirmed" : "Error"}
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
