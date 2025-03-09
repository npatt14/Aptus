import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { createShift, getAllShifts } from "../api/shiftAPI";

// Define types
interface Shift {
  id: string;
  position: string;
  start_time: string;
  end_time: string;
  rate: string;
  status: string;
  created_at: string;
}

interface ShiftContextType {
  shifts: Shift[];
  loading: boolean;
  error: string | null;
  submitShift: (text: string) => Promise<void>;
  refreshShifts: () => Promise<void>;
  submissionSuccess: boolean;
  clearSubmissionStatus: () => void;
}

// Create context with default values
const ShiftContext = createContext<ShiftContextType>({
  shifts: [],
  loading: false,
  error: null,
  submitShift: async () => {},
  refreshShifts: async () => {},
  submissionSuccess: false,
  clearSubmissionStatus: () => {},
});

export const useShifts = () => useContext(ShiftContext);

export const ShiftProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Memoize the refreshShifts function to prevent unnecessary re-renders
  const refreshShifts = useCallback(async () => {
    if (loading) return; // Prevent multiple simultaneous requests

    setLoading(true);
    setError(null);

    try {
      const data = await getAllShifts();
      setShifts(data);
    } catch (err: any) {
      console.error("Error fetching shifts:", err);
      setError(
        err.message || "Failed to fetch shifts. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const submitShift = async (text: string) => {
    if (loading) return; // Prevent multiple simultaneous submissions

    setLoading(true);
    setError(null);
    setSubmissionSuccess(false);

    try {
      await createShift(text);
      setSubmissionSuccess(true);
      // Refresh shifts to include the new one
      const data = await getAllShifts();
      setShifts(data);
    } catch (err: any) {
      console.error("Error submitting shift:", err);
      setError(err.message || "Failed to create shift. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearSubmissionStatus = useCallback(() => {
    setSubmissionSuccess(false);
    setError(null);
  }, []);

  return (
    <ShiftContext.Provider
      value={{
        shifts,
        loading,
        error,
        submitShift,
        refreshShifts,
        submissionSuccess,
        clearSubmissionStatus,
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
};
