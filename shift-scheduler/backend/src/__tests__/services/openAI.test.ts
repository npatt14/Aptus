import { describe, expect, jest, test } from "@jest/globals";
import { mockOpenAIResponse, createEvaluationResponse } from "../testUtils";

// Set up mockks for everythng except the module being tested
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

describe("OpenAI Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("parseShiftDescription", () => {
    test("successfully parses a valid shift description", async () => {
      // Set up test data
      const text = "Need a nurse tomorrow from 9am to 5pm at $25/hr";
      const timezone = "America/New_York";

      // Call the function
      const result = await parseShiftDescription(text, timezone);

      // Verify results
      expect(result).toBeDefined();
      expect(result.position).toBe(mockOpenAIResponse.position);
      expect(result.start_time).toBe(mockOpenAIResponse.start_time);
      expect(result.end_time).toBe(mockOpenAIResponse.end_time);
      expect(result.rate).toBe(mockOpenAIResponse.rate);

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
