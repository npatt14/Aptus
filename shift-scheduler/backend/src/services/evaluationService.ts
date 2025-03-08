import { OpenAIResponse } from "../types/shiftTypes";
import { isValidISODateString } from "./dateUtils";

/**
 * Evaluation service that validates the quality and accuracy of LLM responses
 */

// Evaluates if all required fields are present in the response
export const validateRequiredFields = (response: OpenAIResponse): boolean => {
  if (
    !response.position ||
    !response.start_time ||
    !response.end_time ||
    !response.rate
  ) {
    console.error("LLM Evaluation Failed: Missing required fields");
    return false;
  }
  return true;
};

// Evaluates if the dates are in valid ISO format
export const validateDateFormats = (response: OpenAIResponse): boolean => {
  if (
    !isValidISODateString(response.start_time) ||
    !isValidISODateString(response.end_time)
  ) {
    console.error("LLM Evaluation Failed: Invalid date format");
    return false;
  }
  return true;
};

// Evaluates if the end time is after the start time
export const validateTimeSequence = (response: OpenAIResponse): boolean => {
  const startTime = new Date(response.start_time);
  const endTime = new Date(response.end_time);

  if (endTime <= startTime) {
    console.error("LLM Evaluation Failed: End time must be after start time");
    return false;
  }
  return true;
};

// Evaluates if the position is a recognized healthcare role
export const validatePosition = (response: OpenAIResponse): boolean => {
  const validPositions = [
    "nurse",
    "doctor",
    "physician",
    "surgeon",
    "anesthesiologist",
    "pediatrician",
    "psychiatrist",
    "radiologist",
    "pharmacist",
    "therapist",
    "technician",
    "respiratory therapist",
    "physical therapist",
    "occupational therapist",
    "speech therapist",
    "medical assistant",
    "phlebotomist",
    "paramedic",
    "emt",
    "midwife",
    "dentist",
    "optometrist",
    "audiologist",
  ];

  const position = response.position.toLowerCase();
  const isValid = validPositions.some((valid) => position.includes(valid));

  if (!isValid) {
    console.log(
      "Position validation warning: Unusual healthcare role detected:",
      response.position
    );
    // We don't return false here as this is more of a soft check
  }

  return true;
};

// Runs all evaluations and returns detailed results
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
  const results = {
    requiredFields: validateRequiredFields(response),
    dateFormats: validateDateFormats(response),
    timeSequence: validateTimeSequence(response),
    position: validatePosition(response),
  };

  const valid =
    results.requiredFields && results.dateFormats && results.timeSequence;

  console.log("LLM Evaluation Results:", {
    valid,
    results,
    response,
  });

  return { valid, results };
};
