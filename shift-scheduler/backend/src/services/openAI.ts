import OpenAI from "openai";
import { OpenAIResponse } from "../types/shiftTypes";
import { getCurrentDateForPrompt } from "./dateUtils";
import { evaluateLLMResponse } from "./evaluationService";

// Environment detection
const isTestEnvironment = process.env.NODE_ENV === "test";
const isDevelopmentEnvironment =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
const isNonProductionEnvironment =
  isTestEnvironment || isDevelopmentEnvironment;

// Check for API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API key");
}

console.log(
  `OpenAI initialized with API key in ${
    process.env.NODE_ENV || "development"
  } environment`
);

// Initialize the OpenAI client with the real API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Parse natural language shift description using OpenAI
 */
export const parseShiftDescription = async (
  text: string,
  timezone: string
): Promise<OpenAIResponse> => {
  const currentDate = getCurrentDateForPrompt(timezone);

  console.log(
    `Processing shift description: "${text}" with timezone: ${timezone}`
  );
  console.log(`Current date for context: ${currentDate}`);

  const systemPrompt = `
You are a healthcare shift scheduling assistant. Your task is to parse natural language descriptions of shifts into structured data.
Today's date is ${currentDate} in the user's timezone (${timezone}).

Extract the following information:
1. Position/role (e.g., "nurse", "doctor", "respiratory therapist")
2. Start time (in ISO8601 format with timezone)
3. End time (in ISO8601 format with timezone)
4. Hourly rate (as provided, e.g., "$25/hr", "25 dollars per hour")

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
`;

  console.log("Calling OpenAI API with model: gpt-4");

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
    temperature: 0.2,
    // Note: Removed response_format which is not supported with gpt-4
  });

  console.log("Received response from OpenAI");

  const content = response.choices[0]?.message?.content;

  if (!content) {
    console.error("No content in OpenAI response");
    throw new Error("No content in OpenAI response");
  }

  console.log(`OpenAI response content: ${content}`);

  try {
    const parsedResponse = JSON.parse(content) as OpenAIResponse;

    // Use the evaluation service to validate the LLM response
    const evaluation = evaluateLLMResponse(parsedResponse);

    if (!evaluation.valid) {
      console.error("LLM response evaluation failed", evaluation);
      throw new Error("LLM response failed validation checks");
    }

    console.log("Successfully parsed and validated shift:", parsedResponse);
    return parsedResponse;
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
