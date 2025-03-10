import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ShiftProvider } from "../context/ShiftContext";
import "@testing-library/jest-dom";

// Custom renderer that includes context providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ShiftProvider>{children}</ShiftProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from "@testing-library/react";

// Override the render method
export { customRender as render };

// Add a dummy test to make Jest happy
describe("test-utils", () => {
  test("should export render function", () => {
    expect(customRender).toBeDefined();
  });
});
