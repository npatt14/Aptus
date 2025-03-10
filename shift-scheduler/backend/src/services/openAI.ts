import { OpenAIResponse } from "../types/shiftTypes";
import { getCurrentDateForPrompt } from "./dateUtils";
import { evaluateLLMResponse, performLLMEvaluation } from "./evaluationService";
import { openai } from "./apiClient";

const isTestEnvironment = process.env.NODE_ENV === "test";
const isDevelopmentEnvironment =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
const isNonProductionEnvironment =
  isTestEnvironment || isDevelopmentEnvironment;

// Parses a natural language shift description into structured data
export const parseShiftDescription = async (
  text: string,
  timezone: string
): Promise<{
  shiftData: OpenAIResponse;
  evaluation: {
    basic: {
      valid: boolean;
      results: {
        requiredFields: boolean;
        dateFormats: boolean;
        timeSequence: boolean;
        position: boolean;
      };
    };
    advanced?: {
      score: number;
      feedback: string;
      correct: boolean;
      metrics: {
        positionAccuracy: number;
        timeAccuracy: number;
        rateAccuracy: number;
        overallQuality: number;
      };
    };
  };
}> => {
  const currentDate = getCurrentDateForPrompt(timezone);

  console.log(
    `Processing shift description: "${text}" with timezone: ${timezone}`
  );
  console.log(`Current date for context: ${currentDate}`);

  // Construct a detailed system prompt with instructions and validation requirements
  const systemPrompt = `
You are a healthcare shift scheduling assistant. Your task is to parse natural language descriptions of shifts into structured data.
Today's date is ${currentDate} in the user's timezone (${timezone}).

Extract the following information:
1. Position/role (e.g., "nurse", "doctor", "respiratory therapist")
2. Start time (in ISO8601 format with timezone)
3. End time (in ISO8601 format with timezone)
4. Hourly rate (as provided, e.g., "$25/hr", "25 dollars per hour")

VALIDATION REQUIREMENTS:
- Position must be a recognized healthcare role (pharmacist, technician, nurse, doctor, physician, surgeon, etc.)
- Dates must be in valid ISO8601 format with timezone
- End time must be after start time
- All fields must be present

If the user mentions relative dates like "tomorrow", "next Friday", or "this weekend", interpret them relative to today's date (${currentDate}).
If no specific year is mentioned, assume the current year.
If no specific hour is given for start/end times, assume 9:00 AM for start time and 5:00 PM for end time.

Your response must be in this format:
{
  "position": string,
  "start_time": string (ISO8601 with timezone),
  "end_time": string (ISO8601 with timezone),
  "rate": string
}

If you cannot extract all required information, respond with:
{
  "error": "Missing information: [specify what's missing]"
}
`;

  console.log("Calling OpenAI API with model: gpt-4");

  // Performance optimization: Use specific temperature setting to reduce hallucinations
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
    temperature: 0.2, // Lower temperature for more deterministic outputs
  });

  console.log("Received response from OpenAI");

  const content = response.choices[0]?.message?.content;

  if (!content) {
    console.error("No content in OpenAI response");
    throw new Error("No content in OpenAI response");
  }

  console.log(`OpenAI response content: ${content}`);

  try {
    // Parse the JSON response into our expected structure
    const parsedResponse = JSON.parse(content) as OpenAIResponse;

    // Use the evaluation service to validate the LLM response structure and format
    const basicEvaluation = evaluateLLMResponse(parsedResponse);

    if (!basicEvaluation.valid) {
      console.error("LLM response evaluation failed", basicEvaluation);
      throw new Error("LLM response failed validation checks");
    }

    // If we passed basic validation, perform the advanced evaluation
    // Skip in test environment
    let advancedEvaluation = undefined;
    if (!isTestEnvironment) {
      try {
        advancedEvaluation = await performLLMEvaluation(
          text,
          parsedResponse,
          timezone
        );

        // Log the evaluation results for monitoring
        console.log("Advanced LLM Evaluation Results:", advancedEvaluation);

        // If the advanced evaluation indicates the response is incorrect,
        // we can still choose to proceed but with a warning
        if (!advancedEvaluation.correct) {
          console.warn(
            "LLM response was flagged as potentially incorrect in advanced evaluation",
            advancedEvaluation.feedback
          );
        }
      } catch (evaluationError) {
        // We'll log but not fail if the advanced evaluation fails
        console.error("Advanced LLM evaluation failed:", evaluationError);
      }
    }

    console.log("Successfully parsed and validated shift:", parsedResponse);

    return {
      shiftData: parsedResponse,
      evaluation: {
        basic: basicEvaluation,
        advanced: advancedEvaluation,
      },
    };
  } catch (error) {
    console.error("Error processing OpenAI response:", error);

    if (error instanceof SyntaxError) {
      throw new Error(
        "Failed to parse OpenAI response as JSON. The model did not return valid JSON."
      );
    }

    throw error;
  }
};
