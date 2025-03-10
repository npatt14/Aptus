import { describe, expect, jest, test } from "@jest/globals";
import { parseShiftDescription } from "../../services/openAI";
import { OpenAIResponse } from "../../types/shiftTypes";

// Mock the OpenAI module
jest.mock("openai", () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: jest.fn().mockImplementation(async () => {
              return {
                choices: [
                  {
                    message: {
                      content: JSON.stringify({
                        position: "nurse",
                        start_time: "2025-03-15T09:00:00-04:00",
                        end_time: "2025-03-15T17:00:00-04:00",
                        rate: "$25/hr",
                      }),
                    },
                  },
                ],
              };
            }),
          },
        },
      };
    }),
  };
});

// Mock the date utils to provide consistent results
jest.mock("../../services/dateUtils", () => {
  return {
    getCurrentDateForPrompt: jest
      .fn()
      .mockReturnValue("Friday, March 14th, 2025"),
    isValidISODateString: jest.fn().mockReturnValue(true),
  };
});

// Mock the evaluation service for predictable results
jest.mock("../../services/evaluationService", () => {
  return {
    evaluateLLMResponse: jest.fn().mockReturnValue({
      valid: true,
      results: {
        requiredFields: true,
        dateFormats: true,
        timeSequence: true,
        position: true,
      },
    }),
  };
});

describe("OpenAI Service", () => {
  describe("parseShiftDescription", () => {
    test("successfully parses a valid shift description", async () => {
      // Set up test data
      const text = "Need a nurse tomorrow from 9am to 5pm at $25/hr";
      const timezone = "America/New_York";

      // Call the function
      const result = await parseShiftDescription(text, timezone);

      // Verify results
      expect(result).toBeDefined();
      expect(result.position).toBe("nurse");
      expect(result.start_time).toBe("2025-03-15T09:00:00-04:00");
      expect(result.end_time).toBe("2025-03-15T17:00:00-04:00");
      expect(result.rate).toBe("$25/hr");
    });

    // This test would require additional mocking setup
    test("handles API errors gracefully", async () => {
      // Set up a mock implementation that throws an error
      jest
        .spyOn(OpenAI.prototype.chat.completions, "create")
        .mockImplementationOnce(() => {
          throw new Error("API error");
        });

      // Set up test data
      const text = "incomplete description";
      const timezone = "America/New_York";

      // Call and verify error handling
      await expect(parseShiftDescription(text, timezone)).rejects.toThrow();
    });
  });
});
