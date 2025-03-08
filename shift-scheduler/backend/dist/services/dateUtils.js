"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidISODateString = exports.getCurrentDateForPrompt = exports.getCurrentDateInTimezone = void 0;
const date_fns_tz_1 = require("date-fns-tz");
/**
 * Gets the current date in ISO format for the specified timezone
 */
const getCurrentDateInTimezone = (timezone) => {
    return (0, date_fns_tz_1.formatInTimeZone)(new Date(), timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
};
exports.getCurrentDateInTimezone = getCurrentDateInTimezone;
/**
 * Gets the current date in a human-readable format for the specified timezone
 * to be used in the prompt to OpenAI
 */
const getCurrentDateForPrompt = (timezone) => {
    return (0, date_fns_tz_1.formatInTimeZone)(new Date(), timezone, "EEEE, MMMM do, yyyy");
};
exports.getCurrentDateForPrompt = getCurrentDateForPrompt;
/**
 * Validates that a date string is in ISO8601 format
 */
const isValidISODateString = (dateString) => {
    try {
        const date = new Date(dateString);
        return !isNaN(date.getTime()) && dateString.includes("T");
    }
    catch (error) {
        return false;
    }
};
exports.isValidISODateString = isValidISODateString;
//# sourceMappingURL=dateUtils.js.map