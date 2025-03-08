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

const ShiftList: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const data = await getAllShifts();
        setShifts(data);
      } catch (err) {
        setError("Failed to load shifts. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShifts();
  }, []);

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
      <div className="w-full max-w-4xl mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Shifts</h2>
        <div className="flex justify-center">
          <p className="text-gray-500">Loading shifts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Shifts</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Shifts</h2>

      {shifts.length === 0 ? (
        <p className="text-gray-500">No shifts scheduled yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full h-16 border-b border-gray-200">
                <th className="text-left pl-4 pr-2 text-gray-600">Position</th>
                <th className="text-left px-2 text-gray-600">Start Time</th>
                <th className="text-left px-2 text-gray-600">End Time</th>
                <th className="text-left px-2 text-gray-600">Rate</th>
                <th className="text-left px-2 text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr
                  key={shift.id}
                  className="h-16 border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="pl-4 pr-2">
                    {shift.status === "success" ? (
                      <span className="font-medium">{shift.position}</span>
                    ) : (
                      <span className="text-gray-400 italic">
                        Processing...
                      </span>
                    )}
                  </td>
                  <td className="px-2">
                    {shift.status === "success" ? (
                      formatDate(shift.start_time)
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2">
                    {shift.status === "success" ? (
                      formatDate(shift.end_time)
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2">
                    {shift.status === "success" ? (
                      shift.rate
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2">
                    {shift.status === "success" ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Success
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
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
