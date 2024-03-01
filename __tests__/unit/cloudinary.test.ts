/**
 * @jest-environment node
 */

import { describe, expect, test, it, beforeAll } from "@jest/globals";
import { uploadFile, deleteFile } from "@/lib/cloudinary";
import { bufferToB64 } from "@/lib/utils";
import { createCanvas } from "canvas";
function createTestImage() {
  const width: number = 500;
  const height: number = 500;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Draw on the canvas with random colors
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const red = Math.floor(Math.random() * 256);
      const green = Math.floor(Math.random() * 256);
      const blue = Math.floor(Math.random() * 256);
      ctx.fillStyle = `rgb(${red},${green},${blue})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Convert the canvas to base64
  const base64Image: string = canvas.toDataURL("image/jpeg");
  return base64Image;
}
describe("Testing Cloudinary", () => {
  const testString = "6AB4D556Y78ASYU";
  const buffer = Buffer.from(testString);
  const fileUrl = bufferToB64(buffer, "text/plain");
  let FileSrc: { src: string; type: "image" | "raw" }[] = [];
  // ...

  it("Upload Files to cloudinary", async () => {
    const resp = await uploadFile(fileUrl);
    FileSrc.push({ src: resp.secure_url, type: "raw" });
    expect(resp.secure_url).toContain("https://res.cloudinary.com");
  });

  it("Upload test image to cloudinary", async () => {
    const image = createTestImage();
    const resp = await uploadFile(image, "image");
    console.log(resp.secure_url);
    FileSrc.push({ src: resp.secure_url, type: "image" });
    expect(resp.secure_url).toContain("https://res.cloudinary.com");
  });
  it("delete Files to cloudinary", async () => {
    for (const file of FileSrc) {
      const resp = await deleteFile(file.src);
      expect(resp.result).toBe("ok");
    }
  });
});
