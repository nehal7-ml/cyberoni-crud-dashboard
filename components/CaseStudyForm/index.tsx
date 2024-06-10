"use client";
import { CreateCaseStudyDTO, UserPersona } from "@/crud/DTOs";
import { useEffect, useMemo, useState } from "react";
import AddImage from "../AddImagesAndTags/AddImage";
import Image from "next/image";
import { PlusCircle, X } from "lucide-react";
import { CreateImageDTO } from "@/crud/DTOs";
import ListInput from "../ListInput";
import Notification, { useNotify } from "../Notification";
import { Service } from "@prisma/client";
import LoadingDots from "../shared/loading-dots";
import { SafeParseReturnType } from "zod";
import DynamicInput from "../DynamicInput";
import { caseStudyFormSchema, userPersona } from "./formSchema";
import { useRouter } from "next/navigation";
import JsonInput from "../shared/JsonInput";
import example from "./example.json";
import { CaseStudySchema } from "../zodSchemas";
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
  initial?: CreateCaseStudyDTO;
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useNotify();
  const router = useRouter();
  const [userPersonaForm, setUserPersonaForm] = useState(false);

  const [caseData, setCaseData] = useState<CreateCaseStudyDTO>(
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
          keyLearning: "Key learnings",
          preview: "test preview",
          title: "Test Title",
          userFlow: [],
          userProblems: [],
          userPersonas: [],
          wireFrames: [],
          uniqueFeatures: "Unique Features",
          possibleSolutions: [],
          problemStatement: "Test Problem",
          userResearch: "User Research",
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

    console.log(caseData);
    const res = await fetch(`${action}`, {
      method: method,
      body: JSON.stringify(caseData),
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

  function handleDataChange(data: CreateCaseStudyDTO) {
    setCaseData((prev) => ({
      ...prev,
      ...data,
      userPersonas: data.userPersonas.map((userPersona) => ({
        ...userPersona,
        // @ts-expect-error
        image: userPersona.image ? userPersona.image[0] : undefined,
      })),
    }));
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
              <JsonInput
                rawJson={rawJson}
                parseJson={parseJson}
                setRawJson={setRawJson}
                example={JSON.stringify(example, null, 2)}
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Service :
                </label>
                <select
                  name="serviceId"
                  className="mt-1 w-full rounded border p-2"
                  value={caseData.serviceId ?? types[0].id}
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
                  disabled={useMemo(() => {
                    return caseData.serviceId && caseData.serviceId?.length > 0
                      ? false
                      : true;
                  }, [caseData.serviceId])}
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

              <DynamicInput
                schema={caseStudyFormSchema}
                defaultValue={useMemo(
                  () => ({
                    ...caseData,
                    userPersonas: caseData.userPersonas?.map((userPersona) => ({
                      ...userPersona,
                      image: userPersona.image ? [userPersona.image] : [],
                    })),
                  }),
                  [caseData],
                )}
                onChange={handleDataChange}
              />
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
