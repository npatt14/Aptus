import "./mockSetup";
import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import { parseShiftDescription } from "../src/services/openAI";

describe("Shift parsing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Correctly parse valid natural language input", async () => {
    // Test the parsing function with the mocked OpenAI response
    const result = await parseShiftDescription(
      "Need a nurse tomorrow from 9am to 5pm at $25/hr",
      "America/New_York"
    );

    // Verify the result
    expect(result).toEqual({
      position: "nurse",
      start_time: "2024-01-02T09:00:00-05:00",
      end_time: "2024-01-02T17:00:00-05:00",
      rate: "$25/hr",
    });
  });

  test("Handles unsuccessful parsing gracefully", async () => {
    // Mock an incomplete OpenAI response
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              // Missing required fields
              position: "nurse",
              rate: "$25/hr",
              // start_time and end_time are missing
            }),
          },
        },
      ],
    };

    // Set up the mock implementation
    mockOpenAI.prototype.chat.completions.create = jest
      .fn()
      .mockResolvedValue(mockResponse);

    // Test the parsing function
    await expect(
      parseShiftDescription(
        "Need a nurse tomorrow at $25/hr",
        "America/New_York"
      )
    ).rejects.toThrow("Incomplete data in OpenAI response");
  });

  test("Handles OpenAI API errors gracefully", async () => {
    // Mock an API error
    mockOpenAI.prototype.chat.completions.create = jest
      .fn()
      .mockRejectedValue(new Error("API error"));

    // Test the parsing function
    await expect(
      parseShiftDescription(
        "Need a nurse tomorrow at $25/hr",
        "America/New_York"
      )
    ).rejects.toThrow("Failed to parse shift description");
  });
});
