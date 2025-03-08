import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

// Check for Supabase credentials
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error("Missing Supabase credentials in environment variables");
  process.exit(1);
}

console.log("Environment variables loaded successfully");
console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL.substring(0, 10)}...`);
console.log(`SUPABASE_KEY: ${process.env.SUPABASE_KEY.substring(0, 10)}...`);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

console.log("Supabase client initialized");

// Test function to insert a shift
async function insertTestShift() {
  const testShift = {
    position: "Test Nurse",
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
    rate: "$30/hr",
    raw_input: "Test shift entry",
    status: "success",
  };

  console.log("Inserting test shift:", testShift);

  const { data, error } = await supabase
    .from("shifts")
    .insert(testShift)
    .select();

  if (error) {
    console.error("Error inserting test shift:", error);
    return null;
  }

  console.log("Test shift inserted successfully:", data);
  return data[0];
}

// Test function to retrieve shifts
async function getShifts() {
  console.log("Retrieving all shifts...");

  const { data, error } = await supabase
    .from("shifts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error retrieving shifts:", error);
    return [];
  }

  console.log(`Retrieved ${data.length} shifts`);
  return data;
}

// Main test function
async function runTest() {
  try {
    console.log("Testing database connection...");

    // Insert a test shift
    const inserted = await insertTestShift();
    if (!inserted) {
      console.error("Failed to insert test shift");
      return;
    }

    // Get all shifts including the one we just added
    const shifts = await getShifts();

    // Print out each shift
    console.log("\nShifts in database:");
    shifts.forEach((shift, index) => {
      console.log(`\n[${index + 1}] Shift ID: ${shift.id}`);
      console.log(`Position: ${shift.position}`);
      console.log(`Start time: ${shift.start_time}`);
      console.log(`End time: ${shift.end_time}`);
      console.log(`Rate: ${shift.rate}`);
      console.log(`Status: ${shift.status}`);
      console.log(`Created at: ${shift.created_at}`);
    });

    console.log("\nDatabase test completed successfully");
  } catch (error) {
    console.error("Test failed with error:", error);
  }
}

// Run the test
runTest();
