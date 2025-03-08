"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openAI_1 = require("../services/openAI");
const supabase_1 = require("../services/supabase");
const timezoneMiddleware_1 = require("../middleware/timezoneMiddleware");
const dateUtils_1 = require("../services/dateUtils");
const router = express_1.default.Router();
// Apply timezone middleware to all routes
router.use(timezoneMiddleware_1.timezoneMiddleware);
/**
 * POST /api/shifts - Create a new shift
 */
router.post("/", async (req, res) => {
    const { text } = req.body;
    const timezone = req.app.locals.timezone;
    if (!text) {
        return res.status(400).json({
            error: "Missing shift description",
            message: "Please provide a shift description",
        });
    }
    try {
        // Parse the shift description using OpenAI
        const parsedShift = await (0, openAI_1.parseShiftDescription)(text, timezone);
        // Validate the parsed start and end times
        if (!(0, dateUtils_1.isValidISODateString)(parsedShift.start_time) ||
            !(0, dateUtils_1.isValidISODateString)(parsedShift.end_time)) {
            throw new Error("Invalid date format in parsed shift");
        }
        // Create the shift record
        const shift = {
            ...parsedShift,
            raw_input: text,
            status: "success",
        };
        // Insert the shift into the database
        const savedShift = await (0, supabase_1.insertShift)(shift);
        return res.status(201).json(savedShift);
    }
    catch (error) {
        console.error("Error creating shift:", error);
        // Create an error record for failed parsing
        try {
            const errorShift = {
                position: "",
                start_time: "",
                end_time: "",
                rate: "",
                raw_input: text,
                status: "error",
            };
            await (0, supabase_1.insertShift)(errorShift);
        }
        catch (dbError) {
            console.error("Error saving error record:", dbError);
        }
        return res.status(422).json({
            error: "Failed to parse shift description",
            message: "We're reviewing your request",
        });
    }
});
/**
 * GET /api/shifts - Get all shifts
 */
router.get("/", async (_req, res) => {
    try {
        const shifts = await (0, supabase_1.getAllShifts)();
        return res.status(200).json(shifts);
    }
    catch (error) {
        console.error("Error fetching shifts:", error);
        return res.status(500).json({
            error: "Failed to fetch shifts",
            message: "An error occurred while retrieving shifts",
        });
    }
});
exports.default = router;
//# sourceMappingURL=shiftRoutes.js.map