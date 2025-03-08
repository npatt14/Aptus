import { OpenAIResponse } from "../types/shiftTypes";
/**
 * Parse natural language shift description using OpenAI
 */
export declare const parseShiftDescription: (text: string, timezone: string) => Promise<OpenAIResponse>;
