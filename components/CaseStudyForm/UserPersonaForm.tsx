import { UserPersona } from "@/crud/casestudy";
import { FormEvent, useRef, useState } from "react";
import AddImage from "../AddImagesAndTags/AddImage";
import ListInput from "../ListInput";

function UserPersonaForm({
  initial,
  onSubmit,
}: {
  initial?: UserPersona;
  onSubmit: (persona: UserPersona) => void;
}) {
  const [persona, setPersona] = useState<UserPersona>({
    age: 0,
    bio: "",
    gender: "",
    goals: [],
    name: "",
    painPoints: [],
    image: undefined,
  });
  const form = useRef(null);
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    if (name == "goals" || name === "painPoints") {
      setPersona((prev) => ({
        ...prev,
        [name]: value.split(","),
      }));
    } else
      setPersona((prev) => ({
        ...prev,
        [name]: value,
      }));
  }
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(persona);
  }

  function handleListInput(name: string, value: string[]) {
    setPersona((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
      <div className="absolute inset-0 z-10 h-full w-screen bg-black bg-opacity-50 backdrop-blur-lg"></div>
      <div className=" fixed top-0 z-50 max-h-screen w-full max-w-4xl overflow-y-auto rounded bg-white  p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">Add user persona</h2>
        <form ref={form} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Persona name:
            </label>

            <input
              type="text"
              className="mt-1 w-full rounded border p-2"
              name="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>

            <input
              type="text"
              className="mt-1 w-full rounded border p-2"
              name="age"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>

            <input
              type="text"
              className="mt-1 w-full rounded border p-2"
              name="gender"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>

            <textarea
              rows={5}
              className="mt-1 w-full rounded border p-2"
              name="bio"
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <ListInput
              label="Goals"
              initial={persona.goals}
              onChange={(values) => handleListInput("goals", values)}
            />
          </div>
          <div className="mb-4">
            <ListInput
              label="Pain points"
              initial={persona.painPoints}
              onChange={(values) => handleListInput("painPoints", values)}
            />
          </div>
          <div className="mb-4">
            <AddImage
              maxImages={1}
              onImagesChange={(images) =>
                setPersona((prev) => ({ ...prev, image: images[0] }))
              }
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Add Persona
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserPersonaForm;
