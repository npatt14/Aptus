import { describe, expect, jest, test, beforeAll } from "@jest/globals";
import dotenv from "dotenv";
import { parseShiftDescription } from "../../services/openAI";
import { performLLMEvaluation } from "../../services/evaluationService";
import { OpenAIResponse } from "../../types/shiftTypes";

// Load environment variables
beforeAll(() => {
  dotenv.config();

  // Check if we're missing API key for the tests
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      "WARNING: OPENAI_API_KEY is not set in environment. LLM evaluation tests will be skipped."
    );
  }
});

describe("LLM Evaluation Tests", () => {
  // Skip the entire suite if no API key
  const shouldRunLLMTests = Boolean(process.env.OPENAI_API_KEY);

  // Add a reasonable timeout for these tests since they call the OpenAI API
  jest.setTimeout(30000);

  (shouldRunLLMTests ? describe : describe.skip)(
    "parseShiftDescription",
    () => {
      test("correctly parses a nurse shift description", async () => {
        const text = "I need a nurse tomorrow from 9am to 5pm at $30/hr";
        const timezone = "America/New_York";

        const { shiftData, evaluation } = await parseShiftDescription(
          text,
          timezone
        );

        // Verify the basic parsing works
        expect(shiftData).toBeDefined();
        expect(shiftData.position).toBe("nurse");
        expect(shiftData.rate).toBe("$30/hr");

        // Verify we have dates in the expected format
        expect(shiftData.start_time).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
        );
        expect(shiftData.end_time).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
        );

        // Verify the basic evaluation passed
        expect(evaluation.basic.valid).toBe(true);

        // Note: Advanced evaluation may be skipped in test environment
      });

      test("correctly parses a doctor shift description", async () => {
        const text =
          "Need a cardiologist on Friday from 12pm to 8pm for $120 per hour";
        const timezone = "America/Chicago";

        const { shiftData, evaluation } = await parseShiftDescription(
          text,
          timezone
        );

        // Verify the basic parsing works
        expect(shiftData).toBeDefined();
        expect(shiftData.position.toLowerCase()).toContain("cardiologist");
        expect(shiftData.rate).toMatch(/\$120/);

        // Verify the basic evaluation passed
        expect(evaluation.basic.valid).toBe(true);
      });

      test("handles ambiguous input by making reasonable assumptions", async () => {
        const text = "Need medical staff this weekend";
        const timezone = "America/Los_Angeles";

        const { shiftData, evaluation } = await parseShiftDescription(
          text,
          timezone
        );

        // The model should handle this vague request with reasonable defaults
        expect(shiftData).toBeDefined();
        expect(shiftData.position).toBeDefined();
        expect(shiftData.start_time).toBeDefined();
        expect(shiftData.end_time).toBeDefined();

        // Basic validation should pass
        expect(evaluation.basic.valid).toBe(true);
      });
    }
  );

  (shouldRunLLMTests ? describe : describe.skip)("performLLMEvaluation", () => {
    test("evaluates a correct parsing with high scores", async () => {
      const originalText = "Need a nurse tomorrow from 9am to 5pm at $30/hr";
      const timezone = "America/New_York";

      // First get a proper parse from the LLM
      const { shiftData } = await parseShiftDescription(originalText, timezone);

      // Then evaluate it with our evaluation LLM
      const evaluation = await performLLMEvaluation(
        originalText,
        shiftData,
        timezone
      );

      // Verify the evaluation structure
      expect(evaluation).toBeDefined();
      expect(evaluation.score).toBeGreaterThan(80); // We expect high accuracy
      expect(evaluation.correct).toBe(true);
      expect(evaluation.metrics).toBeDefined();
      expect(evaluation.metrics.positionAccuracy).toBeGreaterThan(80);
      expect(evaluation.metrics.timeAccuracy).toBeGreaterThan(80);
      expect(evaluation.metrics.rateAccuracy).toBeGreaterThan(80);
      expect(evaluation.metrics.overallQuality).toBeGreaterThan(80);
    });

    test("identifies issues with incorrect parsing", async () => {
      const originalText = "Need a nurse tomorrow from 9am to 5pm at $30/hr";
      const timezone = "America/New_York";

      // Create an intentionally incorrect parse
      const incorrectShiftData: OpenAIResponse = {
        position: "doctor", // Wrong position
        start_time: new Date().toISOString(), // Wrong time
        end_time: new Date(Date.now() + 3600000).toISOString(), // Wrong time
        rate: "$50/hr", // Wrong rate
      };

      // Evaluate the incorrect parse
      const evaluation = await performLLMEvaluation(
        originalText,
        incorrectShiftData,
        timezone
      );

      // Verify the evaluation identifies the issues
      expect(evaluation).toBeDefined();
      expect(evaluation.score).toBeLessThan(70); // We expect lower accuracy
      expect(evaluation.correct).toBe(false);
      expect(evaluation.feedback).toMatch(/wrong|incorrect|error|mismatch/i);
    });
  });
});
