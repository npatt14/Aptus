import { createClient } from "@supabase/supabase-js";
import { Shift } from "../types/shiftTypes";

// Check for Supabase credentials
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

console.log(
  `Supabase initialized with credentials in ${
    process.env.NODE_ENV || "development"
  } environment`
);

// Initialize the Supabase client with real credentials
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Inserts a new shift record into the Supabase database

export const insertShift = async (shift: Shift): Promise<Shift> => {
  console.log("Inserting shift into Supabase:", shift);

  const { data, error } = await supabase
    .from("shifts")
    .insert(shift)
    .select()
    .single();

  if (error) {
    console.error("Error inserting shift:", error);
    throw new Error(`Failed to insert shift: ${error.message}`);
  }

  console.log("Successfully inserted shift, received:", data);

  return data as Shift;
};

// Retrieves all shifts from the database, ordered by creation date

export const getAllShifts = async (): Promise<Shift[]> => {
  console.log("Fetching all shifts from Supabase");

  const { data, error } = await supabase
    .from("shifts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching shifts:", error);
    throw new Error(`Failed to fetch shifts: ${error.message}`);
  }

  console.log(`Successfully fetched ${data?.length || 0} shifts`);
  return data as Shift[];
};
