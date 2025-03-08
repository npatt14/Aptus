import { format, formatInTimeZone } from "date-fns-tz";

/**
 * Gets the current date in ISO format for the specified timezone
 */
export const getCurrentDateInTimezone = (timezone: string): string => {
  return formatInTimeZone(new Date(), timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
};

/**
 * Gets the current date in a human-readable format for the specified timezone
 * to be used in the prompt to OpenAI
 */
export const getCurrentDateForPrompt = (timezone: string): string => {
  return formatInTimeZone(new Date(), timezone, "EEEE, MMMM do, yyyy");
};

/**
 * Validates that a date string is in ISO8601 format
 */
export const isValidISODateString = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.includes("T");
  } catch (error) {
    return false;
  }
};
