// Mock environment variables
process.env.SUPABASE_URL = "https://example.supabase.co";
process.env.SUPABASE_KEY = "mock-supabase-key";


if (!process.env.OPENAI_API_KEY) {
  process.env.OPENAI_API_KEY = "mock-openai-api-key";
}

process.env.NODE_ENV = "test";

// Silence console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  error: console.error,
  warn: console.warn,
};
