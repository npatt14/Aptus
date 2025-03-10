import { describe, expect, jest, test } from "@jest/globals";
import {
  mockOpenAIResponse,
  createEvaluationResponse,
  createShiftEvaluation,
} from "../testUtils";

// This test file uses mocks for unit testing specific components
// It is !!NOT!! intended to validate the LLM's responses - that's done in llmEvaluation.test.ts
// These tests just ensure the openAI service handles data properly, errors correctly, etc etc etc.

jest.mock("../../services/dateUtils", () => ({
  getCurrentDateForPrompt: jest
    .fn()
    .mockImplementation(() => "Friday, March 14th, 2025"),
  isValidISODateString: jest.fn().mockImplementation(() => true),
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

// Create a mock OpenAI class
const createMock = jest.fn().mockImplementation(async () => ({
  choices: [
    {
      message: {
        content: JSON.stringify(mockOpenAIResponse),
      },
    },
  ],
}));

// Create a mock constructor function
const OpenAIMock = jest.fn().mockImplementation(() => ({
  chat: {
    completions: {
      create: createMock,
    },
  },
}));

// Mock the openaii module
jest.mock("openai", () => {
  return {
    __esModule: true,
    default: OpenAIMock,
  };
});

// Import the function under test after all mocks are set up
import { parseShiftDescription } from "../../services/openAI";

describe("OpenAI Service Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("parseShiftDescription", () => {
    test("successfully processes a valid response", async () => {
      // Set up test data
      const text = "Need a nurse tomorrow from 9am to 5pm at $25/hr";
      const timezone = "America/New_York";

      // Call the function
      const result = await parseShiftDescription(text, timezone);

      // Verify results
      expect(result).toBeDefined();
      expect(result.shiftData).toBeDefined();
      expect(result.shiftData.position).toBe(mockOpenAIResponse.position);
      expect(result.shiftData.start_time).toBe(mockOpenAIResponse.start_time);
      expect(result.shiftData.end_time).toBe(mockOpenAIResponse.end_time);
      expect(result.shiftData.rate).toBe(mockOpenAIResponse.rate);

      // Verify evaluation structure
      expect(result.evaluation).toBeDefined();
      expect(result.evaluation.basic).toBeDefined();
      expect(result.evaluation.basic.valid).toBe(true);

      // Verify the mock was called correctly
      expect(createMock).toHaveBeenCalled();
    });

    test("handles API errors gracefully", async () => {
      // Set up the mock to reject
      createMock.mockImplementationOnce(() =>
        Promise.reject(new Error("API error"))
      );

      // Set up test data
      const text = "incomplete description";
      const timezone = "America/New_York";

      // Call and verify error handling
      await expect(parseShiftDescription(text, timezone)).rejects.toThrow();
    });
  });
});
