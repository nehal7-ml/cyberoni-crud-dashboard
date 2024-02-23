import React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, it, beforeAll } from "@jest/globals";
import AddImage from "@/components/AddImagesAndTags/AddImage";
import { CreateImageDTO } from "@/crud/DTOs";

describe("test addimage component", () => {
  let images: CreateImageDTO[] = [];
  function onchange(newImages: CreateImageDTO[]) {
    images = newImages;
  }
  const mockImages = [
    { src: "image1.jpg", name: "Image 1" },
    { src: "image2.jpg", name: "Image 2" },
  ];
  const file = new File(
    [
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAsUAAAKxCAYAAAC7eNHPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUABIkkSURBVHgB7L0JoC1ZVR689q464x3f",
    ],
    "example.jpg",
    { type: ".jpg" },
  );

  it("renders component with default images", () => {
    render(<AddImage defaultImages={mockImages} onImagesChange={() => {}} />);

    // Assert that default images are rendered
    mockImages.forEach((image) => {
      const imageElement = screen.getByAltText(image.name);
      expect(imageElement).toBeDefined();
    });
  });
  it("should test adding a image from disk", async () => {
    const { container, getByText, getByAltText } = render(
      <AddImage onImagesChange={() => {}} />,
    );

    // Trigger file upload
    const fileInput = container.querySelector(
      'input[name="file"]',
    ) as HTMLElement;
    const save = getByText("Save");
    const file = new File(["(binary content)"], "uploadedimage.jpg", {
      type: "image/jpeg",
    });
    fireEvent.change(fileInput, { target: { file: [file] } });
    // Wait for the loading indicator to disappear
    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });
    //console.log(save);
    fireEvent.click(save);

    const uploadedImageElement = screen.getByAltText("uploadedimage.jpg");
    expect(uploadedImageElement).toBeDefined();
    // Assert that the uploaded image is added
  });
});
