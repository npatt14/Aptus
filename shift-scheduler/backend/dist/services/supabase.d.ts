import { Shift } from "../types/shiftTypes";
/**
 * Insert a new shift record into the database
 */
export declare const insertShift: (shift: Shift) => Promise<Shift>;
/**
 * Get all shifts from the database
 */
export declare const getAllShifts: () => Promise<Shift[]>;
