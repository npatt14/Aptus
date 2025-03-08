import { Request, Response, NextFunction } from "express";

/**
 * Middleware to validate the presence and correctness of X-Timezone header
 */
export const timezoneMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  } catch (error) {
    return res.status(400).json({
      error: "Invalid timezone",
      message: "The provided timezone is not valid",
    });
  }
};
