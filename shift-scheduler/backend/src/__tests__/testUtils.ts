import { Shift, OpenAIResponse } from "../types/shiftTypes";
import express from "express";

/**
 * Mock data for shift objects
 */
export const mockShift: Shift = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  position: "doctor",
  start_time: "2025-03-15T08:00:00-04:00",
  end_time: "2025-03-15T16:00:00-04:00",
  rate: "$80/hr",
  raw_input: "Need a doctor tomorrow from 8am to 4pm at $80/hr",
  status: "success",
  created_at: "2025-03-14T12:00:00-04:00",
  updated_at: "2025-03-14T12:00:00-04:00",
};

/**
 * Mock data for Openai responses
 */
export const mockOpenAIResponse: OpenAIResponse = {
  position: "doctor",
  start_time: "2025-03-15T08:00:00-04:00",
  end_time: "2025-03-15T16:00:00-04:00",
  rate: "$80/hr",
};

// Creates a test Express app with the TZ middleware
export const createTestApp = (router: express.Router) => {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.app.locals = { timezone: "America/New_York" };
    next();
  });
  app.use("/api/shifts", router);
  return app;
};

/**
 * Creates an evaluation response for tests
 */
export const createEvaluationResponse = (valid = true) => ({
  valid,
  results: {
    requiredFields: true,
    dateFormats: true,
    timeSequence: true,
    position: true,
  },
});
