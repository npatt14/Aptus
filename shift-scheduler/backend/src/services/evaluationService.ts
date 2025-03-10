import { OpenAIResponse } from "../types/shiftTypes";
import { isValidISODateString } from "./dateUtils";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Basic validation of LLM response structure and data format
 */
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

  // Validate date formats
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

/**
 * Advanced LLM-based evaluation to verify the quality and accuracy of the OpenAI response
 * This uses a second LLM call to evaluate the output of the first, providing an independent assessment
 */
export const performLLMEvaluation = async (
  originalText: string,
  llmResponse: OpenAIResponse,
  timezone: string
): Promise<{
  score: number;
  feedback: string;
  correct: boolean;
  metrics: {
    positionAccuracy: number;
    timeAccuracy: number;
    rateAccuracy: number;
    overallQuality: number;
  };
}> => {
  const evaluationPrompt = `
You are an expert evaluator for healthcare shift parsing systems. Analyze the following:

Original input: "${originalText}"
Timezone context: ${timezone}

The system parsed this input as:
- Position: ${llmResponse.position}
- Start time: ${llmResponse.start_time}
- End time: ${llmResponse.end_time}
- Rate: ${llmResponse.rate}

Evaluate the quality and accuracy of this parsing on a scale from 0-100 for each metric:
1. Position Accuracy: Did the system correctly identify the healthcare role?
2. Time Accuracy: Did the system correctly parse the start and end times with the right timezone?
3. Rate Accuracy: Did the system correctly parse the hourly rate?
4. Overall Quality: How well did the system understand the complete request?

Provide your evaluation in this JSON format:
{
  "positionAccuracy": number,
  "timeAccuracy": number,
  "rateAccuracy": number,
  "overallQuality": number,
  "feedback": "Your detailed assessment explaining the scores",
  "correct": boolean (true if overall acceptable, false if significant errors)
}

Be strict but fair. If there are discrepancies that significantly change the meaning of the request, score those categories low.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: evaluationPrompt }],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in evaluation response");
    }

    const evaluationResult = JSON.parse(content);

    // Calculate an overall score from the metrics
    const score =
      (evaluationResult.positionAccuracy +
        evaluationResult.timeAccuracy +
        evaluationResult.rateAccuracy +
        evaluationResult.overallQuality) /
      4;

    return {
      score,
      feedback: evaluationResult.feedback,
      correct: evaluationResult.correct,
      metrics: {
        positionAccuracy: evaluationResult.positionAccuracy,
        timeAccuracy: evaluationResult.timeAccuracy,
        rateAccuracy: evaluationResult.rateAccuracy,
        overallQuality: evaluationResult.overallQuality,
      },
    };
  } catch (error) {
    console.error("Error performing LLM evaluation:", error);
    throw new Error("Failed to evaluate LLM response quality");
  }
};
