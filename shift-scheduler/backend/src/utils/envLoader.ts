import dotenv from "dotenv";
import path from "path";
import fs from "fs";

/**
 * Loads environment variables from .env file,
 * ensuring they override any existing ones in test environments
 */
export const loadEnvVars = (forceOverride = false): void => {
  const shouldOverride = forceOverride || process.env.NODE_ENV === "test";

  // Basic dotenv config for non-test environments
  if (!shouldOverride) {
    dotenv.config();
    return;
  }

  // For tests or when force override is needed, load directly from file
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const key in envConfig) {
      // Override existing env vars
      process.env[key] = envConfig[key];
    }

    // Log !!only in verbose mode!!
    if (process.env.NODE_ENV === "test") {
      const keyStart = process.env.OPENAI_API_KEY?.substring(0, 7);
      console.log(`Environment loaded from ${envPath}`);
      if (keyStart) {
        console.log(`Using API key starting with: ${keyStart}...`);
      }
    }
  }
};
