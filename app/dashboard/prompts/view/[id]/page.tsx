'use client'
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { createImageDTO } from "@/crud/images";
import { createGptPromptDTO } from "@/crud/prompt";
import { createTagDTO } from "@/crud/tags";
import React, { useEffect, useState } from 'react';
import Notification from "@/components/Notification";
import { useParams } from "next/navigation";

const CreateGptPromptForm: React.FC = () => {

  const [notify, setNotify] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyType, setNotifyType] = useState<'success'|'fail'>('fail');

  const [gptPromptData, setGptPromptData] = useState<createGptPromptDTO>({
    description: '',
    prompt: '',
    temperature: 0,
    max_tokens: 0,
    top_p: 0,
    best_of: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: '',
    timesUsed: 0,
    timesIntegrated: 0,
    costPerToken: 0,
    profitMargin: 0,
    tags: [],
    image: { src: '' },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGptPromptData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-access-token',
      };
      // Send the userData to your backend for creating the user
      const res = await fetch(`${apiUrl}/prompts/${params.id}`, {method: 'POST', body: JSON.stringify(gptPromptData), headers})
      let resJson = await res.json() ;

          if(res.status ==200) {
            setNotify(true); setNotifyMessage(resJson.message);
            setNotifyType('success');
          } else {
            setNotify(true); setNotifyMessage(resJson.message);
            setNotifyType('fail');
          }
  };

  function handleChangedImage(images: createImageDTO[], tags: createTagDTO[]) {
    setGptPromptData ((prevData)=> ({
    ...prevData,
    images,
    tags
    }))

  }


  const params = useParams();

  useEffect(() => {

      async function fetchData() {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;

          const headers = {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer your-access-token',
          };
          // Send the userData to your backend for creating the user
          const res = await fetch(`${apiUrl}/prompts/${params.id}`, { method: 'GET', headers })
          let resJson = await res.json();
          console.log(resJson)

          if (res.status == 200) {
              setGptPromptData(resJson.data as createGptPromptDTO);
          } else {
              setNotify(true); setNotifyMessage(resJson.message);
              setNotifyType('fail');
          }
      }

      fetchData()
  }, []);

  return (
    <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 max-h-screen p-2 flex items-center justify-center">
      <div className="bg-white shadow-md rounded p-8 max-w-md w-full overflow-scroll max-h-screen m-1">
        <h2 className="text-2xl font-semibold mb-4">Create GPT Prompt</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <input
              type="text"
              name="description"
              className="mt-1 p-2 border rounded w-full"
              value={gptPromptData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Prompt:</label>
            <textarea
              name="prompt"
              rows={3}
              className="mt-1 p-2 border rounded w-full"
              value={gptPromptData.prompt}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Stop sequences (comma separated):</label>
            <input
              type="text"
              name="stop"
              className="mt-1 p-2 border rounded w-full"
              value={gptPromptData.stop}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-1 ">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">frequency penalty :</label>
              <input
                type="number"
                name="frequency_penalty"
                className="mt-1 p-2 border rounded w-full"
                value={gptPromptData.frequency_penalty}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">best of:</label>
              <input
                type="number"
                name="best_of"
                className="mt-1 p-2 border rounded w-full"
                value={gptPromptData.best_of}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">presence penalty:</label>
              <input
                type="number"
                name="presence_penalty"
                className="mt-1 p-2 border rounded w-full"
                value={gptPromptData.presence_penalty}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">temperature:</label>
              <input
                type="number"
                name="temperature"
                className="mt-1 p-2 border rounded w-full"
                value={gptPromptData.temperature}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">cost Per Token:</label>
              <input
                type="number"
                name="costPerToken"
                className="mt-1 p-2 border rounded w-full"
                value={gptPromptData.costPerToken}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">max tokens:</label>
              <input
                type="number"
                name="max_tokens"
                className="mt-1 p-2 border rounded w-full"
                value={gptPromptData.max_tokens}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <AddImagesAndTags onImagesAndTagsChange={handleChangedImage}></AddImagesAndTags>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Create GPT Prompt
          </button>
        </form>
      </div>
      {notify && <Notification  message={notifyMessage} type={notifyType}></Notification>}

    </div>
  );
  
};

export default CreateGptPromptForm;
