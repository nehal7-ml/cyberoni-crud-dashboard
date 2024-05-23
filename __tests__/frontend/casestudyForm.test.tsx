/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Service } from "@prisma/client";
import { CreateCaseStudy } from "@/crud/DTOs";
import CaseStudyForm from "@/components/CaseStudyForm";

jest.mock("next/image", () => {
  const MockedImage = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  );
  MockedImage.displayName = "MockedImage";
  return MockedImage;
});

jest.mock("../Notification", () => ({
  useNotify: () => ({ toast: jest.fn() }),
}));

jest.mock("../AddImagesAndTags/AddImage", () => {
  const AddImageMock = () => <div>AddImageMock</div>;
  AddImageMock.displayName = "AddImageMock";
  return AddImageMock;
});

jest.mock("./UserPersonaForm", () => {
  const UserPersonaFormMock = ({ onSubmit }: { onSubmit: () => void }) => <div>UserPersonaFormMock</div>;
  UserPersonaFormMock.displayName = "UserPersonaFormMock";
  return UserPersonaFormMock;
});

jest.mock("../ListInput", () => {
  const ListInputMock = ({ label, onChange, initial }: { label: string; onChange: (value: string[]) => void; initial: string[] }) => (
    <div>
      <label>{label}</label>
      <input
        data-testid={label}
        defaultValue={initial.join(",")}
        onChange={(e) => onChange(e.target.value.split(","))}
      />
    </div>
  );
  ListInputMock.displayName = "ListInputMock";
  return ListInputMock;
});

const mockServices: (Service & {
  SubServices: { id: string; title: string }[];
})[] = [
  {
    id: "1",
    title: "Service 1",
    SubServices: [{ id: "1-1", title: "SubService 1-1" }],
    valueBrought: ["1-1"],
    previewContent: 'preview',
    skillsUsed: ["1-1"],
    htmlEmbed: '<h1>test</h1>',
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: true,
    hourlyRate: 100,
    imageId: "1",
  },
  {
    id: "2",
    title: "Service 2",
    SubServices: [{ id: "2-1", title: "SubService 2-1" }],
    valueBrought: ["1-1"],
    previewContent: 'preview',
    skillsUsed: ["1-1"],
    htmlEmbed: '<h1>test</h1>',
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: true,
    hourlyRate: 100,
    imageId: "1",
  },
];

const mockInitialData: CreateCaseStudy = {
  serviceId: "1",
  subServices: [{ id: "1-1" }],
  architecture: [],
  competitiveAnalysis: [],
  goals: ["goal1", "goal2"],
  images: [],
  keyLearning: "Initial Key Learning",
  preview: "Initial Preview",
  title: "Initial Title",
  userFlow: [],
  userProblems: ["problem1", "problem2"],
  userPersonas: [],
  wireFrames: [],
  uniqueFeatures: "Initial Unique Features",
  possibleSolutions: ["solution1", "solution2"],
  problemStatement: "Initial Problem Statement",
  userResearch: "Initial User Research",
  hifiDesign: [],
};

describe("CaseStudyForm", () => {
  it("parses and updates form state from JSON input correctly", async () => {
    render(
      <CaseStudyForm
        method="POST"
        action="/api/case-study"
        types={mockServices}
        initial={mockInitialData}
      />,
    );

    const jsonInput = screen.getByLabelText(/Json input auto fill:/i);
    const parseButton = screen.getByText(/Parse Json/i);

    const newJsonData = {
      serviceId: "2",
      subServices: [{ id: "2-1" }],
      architecture: [],
      competitiveAnalysis: [],
      goals: ["new goal1", "new goal2"],
      images: [],
      keyLearning: "New Key Learning",
      preview: "New Preview",
      title: "New Title",
      userFlow: [],
      userProblems: ["new problem1", "new problem2"],
      userPersonas: [],
      wireFrames: [],
      uniqueFeatures: "New Unique Features",
      possibleSolutions: ["new solution1", "new solution2"],
      problemStatement: "New Problem Statement",
      userResearch: "New User Research",
      hifiDesign: [],
    };

    fireEvent.change(jsonInput, {
      target: { value: JSON.stringify(newJsonData, null, 2) },
    });

    fireEvent.click(parseButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue("New Title")).toBeInTheDocument();
      expect(screen.getByDisplayValue("New Preview")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("New Problem Statement"),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("New Key Learning")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("New Unique Features"),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("New User Research")).toBeInTheDocument();
    });

    const goalsInput = screen.getByTestId("Goals");
    expect(goalsInput.textContent).toBe("new goal1,new goal2");

    const possibleSolutionsInput = screen.getByTestId("Possible solutions");
    expect(possibleSolutionsInput.textContent).toBe("new solution1,new solution2");

    const userProblemsInput = screen.getByTestId("User Problem ");
    expect(userProblemsInput.textContent).toBe("new problem1,new problem2");
  });
});
