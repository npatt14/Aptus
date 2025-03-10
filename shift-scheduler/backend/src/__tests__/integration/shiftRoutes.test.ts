import { describe, expect, jest, test, beforeEach } from "@jest/globals";
import { Shift, ShiftEvaluation } from "../../types/shiftTypes";
import {
  mockShift,
  mockOpenAIResponse,
  createTestApp,
  createEvaluationResponse,
} from "../testUtils";
import request from "supertest";

// Mock the required modules
jest.mock("../../services/openAI", () => ({
  parseShiftDescription: jest.fn().mockImplementation(() => ({
    shiftData: mockOpenAIResponse,
    evaluation: {
      basic: createEvaluationResponse(),
      advanced: {
        score: 95.5,
        feedback: "Excellent parsing of the shift information.",
        correct: true,
        metrics: {
          positionAccuracy: 100,
          timeAccuracy: 95,
          rateAccuracy: 100,
          overallQuality: 87,
        },
      },
    },
  })),
}));

jest.mock("../../services/supabase", () => ({
  insertShift: jest.fn().mockImplementation(() => mockShift),
  getAllShifts: jest.fn().mockImplementation(() => [mockShift]),
}));

jest.mock("../../services/evaluationService", () => ({
  evaluateLLMResponse: jest
    .fn()
    .mockImplementation(() => createEvaluationResponse()),
  performLLMEvaluation: jest.fn().mockImplementation(() => ({
    score: 95.5,
    feedback: "Excellent parsing of the shift information.",
    correct: true,
    metrics: {
      positionAccuracy: 100,
      timeAccuracy: 95,
      rateAccuracy: 100,
      overallQuality: 87,
    },
  })),
}));

// Import dependencies after mocks are set up
import shiftRoutes from "../../api/shiftRoutes";

// Create a test Express app
const app = createTestApp(shiftRoutes);

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
      expect(response.body.shift.position).toBe(mockShift.position);
      expect(response.body.shift.rate).toBe(mockShift.rate);
      expect(response.body).toHaveProperty("evaluation");
      expect(response.body.evaluation).toHaveProperty("basic");
      expect(response.body.evaluation.basic).toHaveProperty("valid", true);
      expect(response.body.evaluation).toHaveProperty("advanced");
      expect(response.body.evaluation.advanced).toHaveProperty("score");
      expect(response.body.evaluation.advanced).toHaveProperty("correct", true);
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
      expect(response.body[0]).toHaveProperty("position", mockShift.position);
    });
  });
});
