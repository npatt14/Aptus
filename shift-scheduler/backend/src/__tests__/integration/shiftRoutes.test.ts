import { describe, expect, jest, test, beforeEach } from "@jest/globals";
import request from "supertest";
import express from "express";
import shiftRoutes from "../../api/shiftRoutes";

// Mock the services used by the routes
jest.mock("../../services/openAI", () => ({
  parseShiftDescription: jest.fn().mockResolvedValue({
    position: "doctor",
    start_time: "2025-03-15T08:00:00-04:00",
    end_time: "2025-03-15T16:00:00-04:00",
    rate: "$80/hr",
  }),
}));

jest.mock("../../services/supabase", () => ({
  insertShift: jest.fn().mockResolvedValue({
    id: "123e4567-e89b-12d3-a456-426614174000",
    position: "doctor",
    start_time: "2025-03-15T08:00:00-04:00",
    end_time: "2025-03-15T16:00:00-04:00",
    rate: "$80/hr",
    raw_input: "Need a doctor tomorrow from 8am to 4pm at $80/hr",
    status: "success",
    created_at: "2025-03-14T12:00:00-04:00",
    updated_at: "2025-03-14T12:00:00-04:00",
  }),
  getAllShifts: jest.fn().mockResolvedValue([
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      position: "doctor",
      start_time: "2025-03-15T08:00:00-04:00",
      end_time: "2025-03-15T16:00:00-04:00",
      rate: "$80/hr",
      raw_input: "Need a doctor tomorrow from 8am to 4pm at $80/hr",
      status: "success",
      created_at: "2025-03-14T12:00:00-04:00",
      updated_at: "2025-03-14T12:00:00-04:00",
    },
  ]),
}));

jest.mock("../../services/evaluationService", () => ({
  evaluateLLMResponse: jest.fn().mockReturnValue({
    valid: true,
    results: {
      requiredFields: true,
      dateFormats: true,
      timeSequence: true,
      position: true,
    },
  }),
}));

// Create a test Express app
const app = express();
app.use(express.json());
app.use("/api/shifts", shiftRoutes);

// Mock the req.app.locals for timezone middleware
app.use((req, res, next) => {
  req.app.locals = { timezone: "America/New_York" };
  next();
});

describe("Shift Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/shifts", () => {
    test("creates a new shift with valid input", async () => {
      const response = await request(app)
        .post("/api/shifts")
        .set("X-Timezone", "America/New_York")
        .send({ text: "Need a doctor tomorrow from 8am to 4pm at $80/hr" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("shift");
      expect(response.body.shift).toHaveProperty("id");
      expect(response.body.shift.position).toBe("doctor");
      expect(response.body.shift.rate).toBe("$80/hr");
      expect(response.body).toHaveProperty("evaluation");
      expect(response.body.evaluation).toHaveProperty("valid", true);
    });

    test("returns 400 when missing shift description", async () => {
      const response = await request(app)
        .post("/api/shifts")
        .set("X-Timezone", "America/New_York")
        .send({ text: "" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Missing shift description");
    });
  });

  describe("GET /api/shifts", () => {
    test("returns all shifts", async () => {
      const response = await request(app)
        .get("/api/shifts")
        .set("X-Timezone", "America/New_York");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty("position", "doctor");
    });
  });
});
