/**
 * Gets the current date in ISO format for the specified timezone
 */
export declare const getCurrentDateInTimezone: (timezone: string) => string;
/**
 * Gets the current date in a human-readable format for the specified timezone
 * to be used in the prompt to OpenAI
 */
export declare const getCurrentDateForPrompt: (timezone: string) => string;
/**
 * Validates that a date string is in ISO8601 format
 */
export declare const isValidISODateString: (dateString: string) => boolean;
