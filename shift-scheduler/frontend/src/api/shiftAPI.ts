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
// const getUserTimezone = () => {
//   return Intl.DateTimeFormat().resolvedOptions().timeZone;
// };

export interface Shift {
  id: string;
  position: string;
  start_time: string;
  end_time: string;
  rate: string;
  status: string;
  created_at: string;
}

export interface ApiResponse {
  shift: Shift;
  evaluation?: {
    valid: boolean;
    results: {
      requiredFields: boolean;
      dateFormats: boolean;
      timeSequence: boolean;
      position: boolean;
    };
  };
}

/**
 * Create a new shift from natural language input
 */
export const createShift = async (text: string): Promise<ApiResponse> => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await axios.post(
      `${API_URL}/api/shifts`,
      { text },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Timezone": timezone,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with an error
      throw new Error(error.response.data.message || "Failed to create shift");
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request
      throw new Error("An error occurred. Please try again.");
    }
  }
};

/**
 * Get all shifts
 */
export const getAllShifts = async (): Promise<Shift[]> => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await axios.get(`${API_URL}/api/shifts`, {
      headers: {
        "X-Timezone": timezone,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch shifts");
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("An error occurred. Please try again.");
    }
  }
};
