import { jest } from "@jest/globals";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.test file
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

// Mock OpenAI module
jest.mock("openai", () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    })),
  };
});

// Mock Supabase module
jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: jest.fn().mockImplementation(() => ({
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
  };
});

// Mock date-fns-tz to return a fixed date for testing
jest.mock("date-fns-tz", () => {
  return {
    formatInTimeZone: jest.fn().mockImplementation((date, tz, format) => {
      if (format.includes("EEEE")) {
        return "Monday, January 1st, 2024";
      }
      return "2024-01-01T12:00:00+00:00";
    }),
  };
});
