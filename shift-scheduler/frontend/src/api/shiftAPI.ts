import axios from "axios";

// Get the API URL from environment or use default
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// Create an axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to get user's timezone
const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Post a new shift to the API
 */
export const postShift = async (text: string, timezone: string) => {
  try {
    const response = await api.post(
      "/api/shifts",
      {
        text,
      },
      {
        headers: {
          "X-Timezone": timezone,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error posting shift:", error);
    throw error;
  }
};

/**
 * Get all shifts from the API
 */
export const getAllShifts = async () => {
  try {
    // Always include the timezone header
    const timezone = getUserTimezone();
    console.log("Fetching shifts with timezone:", timezone);

    const response = await api.get("/api/shifts", {
      headers: {
        "X-Timezone": timezone,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shifts:", error);
    throw error;
  }
};
