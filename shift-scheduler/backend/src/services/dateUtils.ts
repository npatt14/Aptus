import { format, formatInTimeZone } from "date-fns-tz";

/**
 * Gets the current date and time in ISO format
 */
export const getCurrentDateInTimezone = (timezone: string): string => {
  return formatInTimeZone(new Date(), timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
};

/**
 * Gets the current date in a human-readable format 
 */
export const getCurrentDateForPrompt = (timezone: string): string => {
  return formatInTimeZone(new Date(), timezone, "EEEE, MMMM do, yyyy");
};

/**
 * Validates that a date string is in ISO format
 */
export const isValidISODateString = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.includes("T");
  } catch (error) {
    return false;
  }
};
