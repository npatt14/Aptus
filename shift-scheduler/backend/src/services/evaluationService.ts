import { OpenAIResponse } from "../types/shiftTypes";
import { isValidISODateString } from "./dateUtils";

/**
 * Streamlined evaluation service that validates the quality of LLM responses
 */

// Validates the LLM response has all required fields and correct data types
export const evaluateLLMResponse = (
  response: OpenAIResponse
): {
  valid: boolean;
  results: {
    requiredFields: boolean;
    dateFormats: boolean;
    timeSequence: boolean;
    position: boolean;
  };
} => {
  // Check for required fields
  const requiredFields = Boolean(
    response.position &&
      response.start_time &&
      response.end_time &&
      response.rate
  );

  // Validate date formats if present
  const dateFormats = Boolean(
    requiredFields &&
      isValidISODateString(response.start_time) &&
      isValidISODateString(response.end_time)
  );

  // Check time sequence if dates are valid
  let timeSequence = false;
  if (dateFormats) {
    const startTime = new Date(response.start_time);
    const endTime = new Date(response.end_time);
    timeSequence = endTime > startTime;
  }

  // Check if position is a healthcare role - less strict here as the prompt handles most validation
  const position = Boolean(response.position && response.position.length > 0);

  // Calculate overall validity
  const valid = requiredFields && dateFormats && timeSequence && position;

  // Log results for monitoring
  console.log("LLM Evaluation Results:", {
    valid,
    results: {
      requiredFields,
      dateFormats,
      timeSequence,
      position,
    },
    response,
  });

  return {
    valid,
    results: {
      requiredFields,
      dateFormats,
      timeSequence,
      position,
    },
  };
};
