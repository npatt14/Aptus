import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ShiftProvider, useShifts } from "../../context/ShiftContext";

// Mock the API calls
jest.mock("../../api/shiftAPI", () => ({
  createShift: jest.fn(),
  getAllShifts: jest.fn(),
}));

// Import the mocked modules
import { createShift, getAllShifts } from "../../api/shiftAPI";

// Create mock data
const mockShift = {
  id: "123",
  position: "nurse",
  start_time: "2025-03-15T09:00:00-04:00",
  end_time: "2025-03-15T17:00:00-04:00",
  rate: "$30/hr",
  status: "success",
  created_at: "2025-03-14T12:00:00-04:00",
};

const mockApiResponse = {
  shift: mockShift,
  evaluation: { valid: true },
};

const mockShifts = [
  {
    id: "123",
    position: "doctor",
    start_time: "2025-03-15T08:00:00-04:00",
    end_time: "2025-03-15T16:00:00-04:00",
    rate: "$80/hr",
    status: "success",
    created_at: "2025-03-14T12:00:00-04:00",
  },
];

// Test component to expose context values
const TestConsumer = () => {
  const context = useShifts();

  return (
    <div>
      <div data-testid="loading">{context.loading.toString()}</div>
      <div data-testid="error">{context.error || "no error"}</div>
      <div data-testid="shifts-count">
        {context.shifts ? context.shifts.length : 0}
      </div>
      <div data-testid="submission-success">
        {context.submissionSuccess.toString()}
      </div>
      <button onClick={() => context.submitShift("test shift")}>Submit</button>
      <button onClick={() => context.refreshShifts()}>Refresh</button>
      <button onClick={() => context.clearSubmissionStatus()}>Clear</button>
    </div>
  );
};

describe("ShiftContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mocks for each test
    (createShift as jest.Mock).mockResolvedValue(mockApiResponse);
    (getAllShifts as jest.Mock).mockResolvedValue(mockShifts);
  });

  test("provides initial context values", () => {
    render(
      <ShiftProvider>
        <TestConsumer />
      </ShiftProvider>
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("error")).toHaveTextContent("no error");
    expect(screen.getByTestId("shifts-count")).toHaveTextContent("0");
    expect(screen.getByTestId("submission-success")).toHaveTextContent("false");
  });

  test("submitShift updates state correctly on success", async () => {
    render(
      <ShiftProvider>
        <TestConsumer />
      </ShiftProvider>
    );

    // Trigger the submitShift function
    const submitButton = screen.getByText("Submit");

    await act(async () => {
      submitButton.click();
      // Ensure the mock resolves within the act
      await Promise.resolve();
    });

    // Wait for state updates
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByTestId("submission-success")).toHaveTextContent(
        "true"
      );
      expect(screen.getByTestId("shifts-count")).toHaveTextContent("1");
    });

    // Verify API was called correctly
    expect(createShift).toHaveBeenCalledWith("test shift");
  });

  test("submitShift handles errors correctly", async () => {
    // Mock API error
    const errorMessage = "Failed to create shift";
    (createShift as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(
      <ShiftProvider>
        <TestConsumer />
      </ShiftProvider>
    );

    // Trigger the submitShift function
    const submitButton = screen.getByText("Submit");

    await act(async () => {
      submitButton.click();
      // Ensure the mock resolves within the act
      await Promise.resolve();
    });

    // Wait for state updates
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByTestId("error")).toHaveTextContent(errorMessage);
      expect(screen.getByTestId("submission-success")).toHaveTextContent(
        "false"
      );
    });
  });

  test("refreshShifts fetches shifts from API", async () => {
    render(
      <ShiftProvider>
        <TestConsumer />
      </ShiftProvider>
    );

    // Trigger the refreshShifts function
    const refreshButton = screen.getByText("Refresh");

    await act(async () => {
      refreshButton.click();
      // Ensure the mock resolves within the act
      await Promise.resolve();
    });

    // Wait for state updates
    await waitFor(() => {
      expect(screen.getByTestId("shifts-count")).toHaveTextContent("1");
    });

    // Verify API was called
    expect(getAllShifts).toHaveBeenCalled();
  });

  test("clearSubmissionStatus resets error and success state", async () => {
    render(
      <ShiftProvider>
        <TestConsumer />
      </ShiftProvider>
    );

    // First submit to set success state
    await act(async () => {
      screen.getByText("Submit").click();
      // Ensure the mock resolves within the act
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByTestId("submission-success")).toHaveTextContent(
        "true"
      );
    });

    // Then clear the state
    await act(async () => {
      screen.getByText("Clear").click();
    });

    // Verify states are reset
    expect(screen.getByTestId("submission-success")).toHaveTextContent("false");
    expect(screen.getByTestId("error")).toHaveTextContent("no error");
  });
});
