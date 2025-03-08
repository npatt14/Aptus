"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timezoneMiddleware = void 0;
/**
 * Middleware to validate the presence and correctness of X-Timezone header
 */
const timezoneMiddleware = (req, res, next) => {
    const timezone = req.headers["x-timezone"];
    if (!timezone || typeof timezone !== "string") {
        return res.status(400).json({
            error: "Missing or invalid X-Timezone header",
            message: "Please provide a valid timezone in the X-Timezone header",
        });
    }
    try {
        // Validate the timezone by attempting to create a date with it
        Intl.DateTimeFormat(undefined, { timeZone: timezone });
        // Store the timezone in the request for later use
        req.app.locals.timezone = timezone;
        next();
    }
    catch (error) {
        return res.status(400).json({
            error: "Invalid timezone",
            message: "The provided timezone is not valid",
        });
    }
};
exports.timezoneMiddleware = timezoneMiddleware;
//# sourceMappingURL=timezoneMiddleware.js.map