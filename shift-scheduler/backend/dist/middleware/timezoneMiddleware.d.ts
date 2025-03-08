import { Request, Response, NextFunction } from "express";
/**
 * Middleware to validate the presence and correctness of X-Timezone header
 */
export declare const timezoneMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
