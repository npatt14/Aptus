import React from "react";
import { render, screen, fireEvent, waitFor } from "../test-utils";
import ShiftInput from "../../components/ShiftInput";
import * as ShiftContext from "../../context/ShiftContext";

// Mock the context hook
jest.mock("../../context/ShiftContext", () => ({
  ...jest.requireActual("../../context/ShiftContext"),
  useShifts: jest.fn(),
}));

describe("ShiftInput Component", () => {
  beforeEach(() => {
    // Reset mocks and provide default implementation
    jest.clearAllMocks();
    jest.spyOn(ShiftContext, "useShifts").mockImplementation(() => ({
      submitShift: jest.fn().mockResolvedValue(undefined),
      loading: false,
      error: null,
      shifts: [],
      refreshShifts: jest.fn(),
      submissionSuccess: false,
      clearSubmissionStatus: jest.fn(),
    }));
  });

  test("allows user to input text and submit the form", async () => {
    // Setup mock for submitShift function
    const submitShiftMock = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(ShiftContext, "useShifts").mockImplementation(() => ({
      submitShift: submitShiftMock,
      loading: false,
      error: null,
      shifts: [],
      refreshShifts: jest.fn(),
      submissionSuccess: false,
      clearSubmissionStatus: jest.fn(),
    }));

    // Render the component
    render(<ShiftInput />);

    // Find the textarea and button
    const textarea = screen.getByPlaceholderText(/Example: Need a nurse/i);
    const submitButton = screen.getByRole("button", {
      name: /Schedule Shift/i,
    });

    // Verify button is initially disabled (no input)
    expect(submitButton).toBeDisabled();

    // Enter text in the textarea
    const shiftDescription = "Need a doctor tomorrow from 8am to 4pm at $80/hr";
    fireEvent.change(textarea, { target: { value: shiftDescription } });

    // Verify button is enabled after input
    expect(submitButton).not.toBeDisabled();

    // Submit the form
    fireEvent.click(submitButton);

    // Verify submitShift was called with the correct text
    expect(submitShiftMock).toHaveBeenCalledWith(shiftDescription);

    // Verify textarea is cleared after submission (optimistic UI update)
    expect(textarea).toHaveValue("");
  });

  test("disables input and shows loading state during submission", async () => {
    // Mock the loading state
    jest.spyOn(ShiftContext, "useShifts").mockImplementation(() => ({
      submitShift: jest
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 100))
        ),
      loading: true,
      error: null,
      shifts: [],
      refreshShifts: jest.fn(),
      submissionSuccess: false,
      clearSubmissionStatus: jest.fn(),
    }));

    // Render the component
    render(<ShiftInput />);

    // Find the textarea and button
    const textarea = screen.getByPlaceholderText(/Example: Need a nurse/i);
    const submitButton = screen.getByRole("button");

    // Verify that the button shows a loading state
    expect(submitButton).toBeDisabled();
    expect(submitButton.textContent).toMatch(/Processing/i);

    // Verify the textarea is disabled during submission
    expect(textarea).toBeDisabled();
  });
});
