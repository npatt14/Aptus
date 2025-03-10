// Mock environment variables
process.env.SUPABASE_URL = "https://example.supabase.co";
process.env.SUPABASE_KEY = "mock-supabase-key";
process.env.OPENAI_API_KEY = "mock-openai-api-key";
process.env.NODE_ENV = "test";

// Silence console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  // Keep error and warn for debugging
  error: console.error,
  warn: console.warn,
};
