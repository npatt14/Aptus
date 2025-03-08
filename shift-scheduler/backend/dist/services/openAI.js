"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseShiftDescription = void 0;
const openai_1 = __importDefault(require("openai"));
const dateUtils_1 = require("./dateUtils");
if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key");
}
// Initialize the OpenAI client
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
/**
 * Parse natural language shift description using OpenAI
 */
const parseShiftDescription = async (text, timezone) => {
    const currentDate = (0, dateUtils_1.getCurrentDateForPrompt)(timezone);
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

Your response must be valid JSON with these exact fields:
{
  "position": string,
  "start_time": string (ISO8601 with timezone),
  "end_time": string (ISO8601 with timezone),
  "rate": string
}
`;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text },
            ],
            response_format: { type: "json_object" },
            temperature: 0.2, // Lower temperature for more deterministic results
        });
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No content in OpenAI response");
        }
        const parsedResponse = JSON.parse(content);
        // Validate that all required fields are present
        if (!parsedResponse.position ||
            !parsedResponse.start_time ||
            !parsedResponse.end_time ||
            !parsedResponse.rate) {
            throw new Error("Incomplete data in OpenAI response");
        }
        return parsedResponse;
    }
    catch (error) {
        console.error("Error parsing shift with OpenAI:", error);
        throw new Error("Failed to parse shift description");
    }
};
exports.parseShiftDescription = parseShiftDescription;
//# sourceMappingURL=openAI.js.map