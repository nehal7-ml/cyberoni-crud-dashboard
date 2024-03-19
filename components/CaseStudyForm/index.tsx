"use client";
import { CaseStudyType, UserPersona } from "@/crud/casestudy";
import { CreateCaseStudy } from "@/crud/DTOs";
import { useEffect, useState } from "react";
import AddImage from "../AddImagesAndTags/AddImage";
import Image from "next/image";
import { PlusCircle, X } from "lucide-react";
import UserPersonaForm from "./UserPersonaForm";
import { CreateImageDTO } from "@/crud/DTOs";
import ListInput from "../ListInput";
import Notification, { toast } from "../Notification";
import { Service } from "@prisma/client";

type SubService = {
  id: string;
  title: string;
};
function CaseStudyForm({
  method,
  action,
  initial,
  types,
}: {
  method: "POST" | "PUT";
  action: string;
  types: (Service & {
    SubServices: SubService[];
  })[];
  initial?: CreateCaseStudy;
}) {
  const [notify, setNotify] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyType, setNotifyType] = useState<"success" | "fail">("fail");
  const [userPersonaForm, setUserPersonaForm] = useState(false);
  const [caseData, setCaseData] = useState<CreateCaseStudy>(
    initial
      ? {
          ...initial,
          serviceId: initial?.serviceId ?? types[0].id,
        }
      : {
          serviceId: types[0].id,
          subServices: [],
          architecture: [],
          competetiveAnalysis: [],
          goals: [],
          images: [],
          keyLearning: "",
          preview: "",
          title: "",
          userFlow: [],
          userProblems: [],
          userPersonas: [],
          wireFrames: [],
          uniqueFeatures: "",
          possibleSolutions: [],
          problemStatement: "",
          userResearch: "",
          hifiDesign: [],
        },
  );
  // console.log(types);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer your-access-token",
    };
    // Send the userData to your backend for creating the user
    console.log(caseData);
    const res = await fetch(`${action}`, {
      method: method,
      body: JSON.stringify(caseData),
      headers,
    });
    let resJson = await res.json();

    if (res.status == 200) {
      toast(`${resJson.message}`, {
        autoClose: 5000,
        type: "success",
      });
    } else {
      toast(`${resJson.message}`, {
        autoClose: 5000,
        type: "error",
      });
    }
  };

  const handleAddSubService = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    let uniqueValues = new Set(caseData.subServices);
    if (value && !uniqueValues.has({ id: value })) {
      setCaseData((prevData) => ({
        ...prevData,
        subServices: prevData.subServices.concat([{ id: value }]),
      }));
    }
  };

  const handleRemoveSubService = (id: string) => {
    setCaseData((prevData) => ({
      ...prevData,
      subServices: prevData.subServices.filter(
        (subService) => subService.id !== id,
      ),
    }));
  };
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "serviceId")
      setCaseData((prevData) => ({
        ...prevData,
        subServices: [],
      }));
    setCaseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function handleListInput(name: string, value: string[]) {
    setCaseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleImageChange(name: string, images: CreateImageDTO[]) {
    console.log(images);
    setCaseData((prevData) => ({
      ...prevData,
      [name]: images,
    }));
  }

  function addPersona(persona: UserPersona) {
    setCaseData((prevData) => ({
      ...prevData,
      userPersonas: [...caseData.userPersonas, persona],
    }));
    setUserPersonaForm(false);
  }

  return (
    <>
      <div className="light:bg-gray-100 light:text-black flex h-[95vh]  max-h-screen items-center justify-center bg-gray-100 dark:bg-gray-700 dark:text-gray-800 ">
        <div className="h-full max-h-full w-full max-w-xl rounded bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">
            {method === "POST" ? "Create" : "Update"} Case study
          </h2>
          <form onSubmit={handleSubmit} className=" h-[90%]">
            <div className="h-full overflow-y-auto px-2 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title:
                </label>
                <input
                  type="text"
                  name="title"
                  className="mt-1 w-full rounded border p-2"
                  value={caseData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Service :
                </label>
                <select
                  name="serviceId"
                  className="mt-1 w-full rounded border p-2"
                  value={caseData.serviceId || types[0].id}
                  onChange={handleInputChange}
                >
                  <option disabled>Select Service</option>
                  {types.map((type, index) => (
                    <option value={type.id} key={index}>
                      {type.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Sub Service :
                </label>
                <div className="my-1 flex flex-wrap gap-2">
                  {caseData.subServices.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-around rounded bg-blue-200 p-2 text-blue-800"
                    >
                      <span className="line-clamp-1">
                        {
                          types
                            .filter((obj) => obj.id === caseData.serviceId)[0]
                            .SubServices.filter((s) => s.id === tag.id)[0].title
                        }
                      </span>
                      <button
                        type="button"
                        className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring focus:ring-red-300"
                        onClick={() => handleRemoveSubService(tag.id)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
                <select
                  name="subServiceId"
                  className={`mt-1 w-full rounded border p-2  disabled:bg-gray-400 disabled:text-gray-400`}
                  onChange={handleAddSubService}
                  disabled={
                    caseData.serviceId && caseData.serviceId?.length > 0
                      ? false
                      : true
                  }
                >
                  <option value={""} className="text-gray-400">
                    Select SubService
                  </option>
                  {caseData.serviceId &&
                    types
                      .filter((obj) => obj.id === caseData.serviceId)[0]
                      .SubServices.map((type, index) => (
                        <option
                          className="text-black"
                          value={type.id}
                          key={index}
                        >
                          {type.title}
                        </option>
                      ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Preview:
                </label>
                <textarea
                  name="preview"
                  rows={7}
                  className="mt-1 w-full rounded border p-2"
                  value={caseData.preview}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  problemStatement:
                </label>
                <textarea
                  name="problemStatement"
                  rows={7}
                  className="mt-1 w-full rounded border p-2"
                  value={caseData.problemStatement}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <ListInput
                  label="Goals"
                  initial={caseData.goals}
                  onChange={(values) => handleListInput("goals", values)}
                />
              </div>
              <div className="mb-4">
                <ListInput
                  label="Possible solutions"
                  initial={caseData.possibleSolutions}
                  onChange={(values) =>
                    handleListInput("possibleSolutions", values)
                  }
                />
              </div>
              <div className="mb-4">
                <ListInput
                  label="User Problem "
                  initial={caseData.userProblems}
                  onChange={(values) => handleListInput("userProblems", values)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Understanding the problems:
                </label>
                <div>
                  <textarea
                    name="userResearch"
                    rows={7}
                    className="mt-1 w-full rounded border p-2"
                    value={caseData.userResearch}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Key Learnings:
                </label>
                <div>
                  <textarea
                    name="keyLearning"
                    rows={7}
                    className="mt-1 w-full rounded border p-2"
                    value={caseData.keyLearning}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mb-4 h-fit   flex-grow">
                <label className="block text-sm font-medium text-gray-700">
                  User Personas:
                </label>
                <div>
                  {caseData.userPersonas?.map((user, index) => {
                    return (
                      <div
                        className={`my-4 flex h-fit w-14 flex-col gap-5 border-2 border-dotted bg-gray-600 p-2 `}
                        key={index}
                      >
                        <div className="h-1/2">
                          <Image
                            src={user.image?.src as string}
                            alt={``}
                            height={500}
                            width={500}
                          ></Image>
                        </div>
                        <div className="justify-evenly">
                          <div className="font-bold  text-white">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex w-full items-end justify-center  p-2">
                  <button
                    type="button"
                    onClick={() => setUserPersonaForm(true)}
                    className="rounded-full bg-blue-500 p-2 hover:bg-blue-600 hover:shadow-lg"
                  >
                    <PlusCircle className=" text-white" />
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image 1 :
                </label>
                <AddImage
                  maxImages={1}
                  defaultImages={caseData.images[0] ? [caseData.images[0]] : []}
                  onImagesChange={(images) =>
                    setCaseData((prev) => ({
                      ...prev,
                      images: [images[0], ...prev.images.slice(1)],
                    }))
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image 2:
                </label>
                <AddImage
                  maxImages={1}
                  defaultImages={caseData.images[1] ? [caseData.images[1]] : []}
                  onImagesChange={(images) =>
                    setCaseData((prev) => ({
                      ...prev,
                      images: [...prev.images.slice(0, 1), images[0]],
                    }))
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Wireframes:
                </label>
                <AddImage
                  maxImages={5}
                  defaultImages={caseData.wireFrames ? caseData.wireFrames : []}
                  onImagesChange={(images) =>
                    handleImageChange("wireFrames", images)
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  hifi designs:
                </label>
                <AddImage
                  maxImages={5}
                  defaultImages={caseData.hifiDesign ? caseData.hifiDesign : []}
                  onImagesChange={(images) =>
                    handleImageChange("hifiDesign", images)
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  user flow:
                </label>
                <AddImage
                  maxImages={5}
                  defaultImages={caseData.userFlow ? caseData.userFlow : []}
                  onImagesChange={(images) =>
                    handleImageChange("userFlow", images)
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  architecture Analysis:
                </label>
                <AddImage
                  maxImages={5}
                  defaultImages={
                    caseData.architecture ? caseData.architecture : []
                  }
                  onImagesChange={(images) =>
                    handleImageChange("architecture", images)
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Competetive Analysis:
                </label>
                <AddImage
                  maxImages={1}
                  defaultImages={
                    caseData.competetiveAnalysis
                      ? caseData.competetiveAnalysis
                      : []
                  }
                  onImagesChange={(images) =>
                    handleImageChange("competetiveAnalysis", images)
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {method === "POST" ? "Create Case study" : "Update Case study"}
            </button>
          </form>
          <div
            className={`container fixed left-0 top-0 mx-auto  flex flex-col justify-center ${userPersonaForm ? "" : " hidden"}`}
          >
            <div className="absolute right-3 top-3 z-30 flex justify-end">
              <button
                type="button"
                className="m-3 self-end"
                onClick={() => setUserPersonaForm(false)}
              >
                <X color="red" className="cursor-pointer" />
              </button>
            </div>
            <UserPersonaForm onSubmit={addPersona} />
          </div>
        </div>
        <Notification />
      </div>
    </>
  );
}

export default CaseStudyForm;
