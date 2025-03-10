import OpenAI from "openai";
import { loadEnvVars } from "../utils/envLoader";

// Ensure environment variables are loaded
loadEnvVars();

// Check for API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API key");
}

// Create and export the OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a refreshable client for tests that need to force new credentials
export const getRefreshedClient = (): OpenAI => {
  // Force reload env vars to ensure API key
  loadEnvVars(true);

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("missing OpenAI API key after refresh");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};
