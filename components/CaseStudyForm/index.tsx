"use client";
import { CreateCaseStudy, UserPersona } from "@/crud/DTOs";
import { useEffect, useMemo, useState } from "react";
import AddImage from "../AddImagesAndTags/AddImage";
import Image from "next/image";
import { PlusCircle, X } from "lucide-react";
import { CreateImageDTO } from "@/crud/DTOs";
import ListInput from "../ListInput";
import Notification, { useNotify } from "../Notification";
import { Service } from "@prisma/client";
import LoadingDots from "../shared/loading-dots";
import { CaseStudySchema } from "./schema";
import { SafeParseReturnType } from "zod";
import DynamicInput from "../DynamicInput";
import { userPersona } from "./zodSchema";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(false);
  const { toast } = useNotify();
  const router = useRouter();
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
          competitiveAnalysis: [],
          goals: [],
          images: [],
          keyLearning: "",
          preview: "test preview",
          title: "Test Title",
          userFlow: [],
          userProblems: [],
          userPersonas: [],
          wireFrames: [],
          uniqueFeatures: "",
          possibleSolutions: [],
          problemStatement: "Test Problem",
          userResearch: "",
          hifiDesign: [],
        },
  );
  const [rawJson, setRawJson] = useState(
    JSON.stringify(CaseStudySchema.parse(caseData), null, 2),
  );

  // console.log(types);
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);

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
    setLoading(false);

    if (res.status == 200) {
      toast(`${resJson.message}`, {
        autoClose: 5000,
        type: "success",
      });

      router.push(`/dashboard/casestudies/view/${resJson.data.id}`);

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
    // console.log(images);
    setCaseData((prevData) => ({
      ...prevData,
      [name]: images,
    }));
  }

  function parseJson(json: string) {
    try {
      const newData = JSON.parse(json);

      const valid = CaseStudySchema.safeParse(newData);
      if (!valid.success)
        for (const e of valid.error.errors) {
          toast(`${e.path} ${e.message}`, {
            type: "error",
          });
        }
      else {
        console.log("parsed data: ", newData);
        setCaseData((prev) => ({ ...prev, ...newData }));
      }
    } catch (error) {
      console.log("invalid JSON", error);
      toast("Invalid JSON", {
        type: "error",
      });
    }
  }



  return (
    <>
      <div className="light:bg-gray-100 light:text-black flex h-[94vh]  max-h-screen items-center justify-center bg-gray-100 dark:bg-gray-700 dark:text-gray-800 ">
        <div className="mx-4 h-full max-h-full  w-full rounded bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">
            {method === "POST" ? "Create" : "Update"} Case study
          </h2>
          <form onSubmit={handleSubmit} className=" h-[90%]">
            <div className="h-full overflow-y-auto px-2 py-4">
              <div className="mb-4">
                <label className="block" htmlFor="json">
                  Json input auto fill:{" "}
                </label>
                <textarea
                  className={"w-full p-3 ring-2 invalid:ring-red-500"}
                  name="json"
                  id=""
                  rows={7}
                  value={rawJson}
                  onChange={(event) => setRawJson(event.target.value)}
                ></textarea>
                <button
                  className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  type="button"
                  onClick={() => parseJson(rawJson)}
                >
                  Parse Json
                </button>
              </div>
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
                  {caseData.subServices &&
                    caseData.subServices.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-around rounded bg-blue-200 p-2 text-blue-800"
                      >
                        <span className="line-clamp-1">
                          {
                            types
                              .filter((obj) => obj.id === caseData.serviceId)[0]
                              .SubServices.filter((s) => s.id === tag.id)[0]
                              .title
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
                <DynamicInput
                  onChange={(value) =>
                    setCaseData({
                      ...caseData,
                      userPersonas: value.map((p: any) => ({
                        ...p,
                        image: p.image[0],
                      })) as UserPersona[],
                    })
                  }
                  defaultValue={useMemo(()=>caseData.userPersonas.map((persona) => ({
                    ...persona,
                    image: [persona.image],
                  })) , [caseData.userPersonas])}
                  schema={userPersona}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image 1 :
                </label>
                <AddImage
                  name="image-1"
                  maxImages={1}
                  defaultImages={useMemo(
                    () => (caseData.images[0] ? [caseData.images[0]] : []),
                    [caseData.images],
                  )}
                  onImagesChange={(images) => {
                    console.log("callcaing chnage");

                    setCaseData((prev) => ({
                      ...prev,
                      images: [images[0], ...prev.images.slice(-1)],
                    }));
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image 2:
                </label>
                <AddImage
                  name="image-2"
                  maxImages={1}
                  defaultImages={useMemo(
                    () => (caseData.images[0] ? [caseData.images[0]] : []),
                    [caseData.images],
                  )}
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
                  name="wireframes"
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
                  name="hifi-design"
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
                  name="user-flow"
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
                  name="architecture-analysis"
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
                  Competitive Analysis:
                </label>
                <AddImage
                  maxImages={1}
                  defaultImages={
                    caseData.competitiveAnalysis
                      ? caseData.competitiveAnalysis
                      : []
                  }
                  onImagesChange={(images) =>
                    handleImageChange("competetiveAnalysis", images)
                  }
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="flex w-full items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {loading ? <LoadingDots /> : null}
              {method === "POST" ? "Create Case study" : "Update Case study"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CaseStudyForm;
