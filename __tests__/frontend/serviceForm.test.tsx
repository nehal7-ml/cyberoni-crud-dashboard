/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SubserviceForm from "@/components/ServiceForm";

describe("SubService Form", () => {
  it("should render the form and allow user input", () => {
    const handleSubmit = jest.fn();
    render(<SubserviceForm action="/api/service/add" method="POST"     />);

    // Check if the form is rendered
    const form = screen.getByTestId("subservice-form");
    expect(form).toBeInTheDocument();

    // Check if the title input is rendered and allow user input
    const titleInput = screen.getByTestId("title-input");
    expect(titleInput).toBeInTheDocument();

    // Simulate user input
    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    expect(titleInput.textContent).toBe("Test Title");

    // Simulate form submission
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalled();
  });

  // Add other tests for each field and interaction as needed
});
