"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllShifts = exports.insertShift = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error("Missing Supabase environment variables");
}
// Initialize the Supabase client
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
/**
 * Insert a new shift record into the database
 */
const insertShift = async (shift) => {
    const { data, error } = await supabase
        .from("shifts")
        .insert(shift)
        .select()
        .single();
    if (error) {
        console.error("Error inserting shift:", error);
        throw new Error(`Failed to insert shift: ${error.message}`);
    }
    return data;
};
exports.insertShift = insertShift;
/**
 * Get all shifts from the database
 */
const getAllShifts = async () => {
    const { data, error } = await supabase
        .from("shifts")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) {
        console.error("Error fetching shifts:", error);
        throw new Error(`Failed to fetch shifts: ${error.message}`);
    }
    return data;
};
exports.getAllShifts = getAllShifts;
//# sourceMappingURL=supabase.js.map