import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage component", () => {
  test("renders error message correctly", () => {
    render(<ErrorMessage message="Test error message" />);

    // Check if the error message is displayed
    const errorText = screen.getByText(/Test error message/i);
    expect(errorText).toBeInTheDocument();

    // Check if the error icon is displayed
    const errorIcon = screen.getByTestId("error-icon");
    expect(errorIcon).toBeInTheDocument();
  });

  test("does not render when message is empty", () => {
    const { container } = render(<ErrorMessage message="" />);

    // Container should be empty
    expect(container.firstChild).toBeNull();
  });
});
