'use client'
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { createEventDTO } from "@/crud/event";
import { createImageDTO } from "@/crud/images";
import { createTagDTO } from "@/crud/tags";
import { EventStatus } from "@prisma/client";
import React, { useState } from 'react';
import Notification from "@/components/Notification";



const CreateEventForm: React.FC = () => {
  const [notify, setNotify] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyType, setNotifyType] = useState<'success'|'fail'>('fail');

  const [eventData, setEventData] = useState<createEventDTO>({
    name: '',
    date: new Date(),
    eventLink: '',
    description: '',
    isVirtual: false,
    location: '',
    status: 'UPCOMING',
    image: { src: '' },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'date') {
      setEventData(prevData => ({
        ...prevData,
        date: new Date(value),
      }));

    } if(name ==='isVirtual') { 
      setEventData(prevData => ({
      ...prevData,
        isVirtual: value === 'on',
      }));
    }else {

      setEventData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your-access-token',
    };
    // Send the userData to your backend for creating the user
    const res = await fetch(`${apiUrl}/events/add`, { method: 'POST', body: JSON.stringify(eventData), headers })
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
    setEventData((prevData) => ({
      ...prevData,
      image: images[0],
    }))

  }

  // Format the Date object into 'YYYY-MM-DD' format
  const year = eventData.date.getFullYear();
  const month = (eventData.date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
  const day = eventData.date.getDate().toString().padStart(2, '0');

  return (
    <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded p-8 max-w-4xl w-full overflow-scroll max-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Create Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name :</label>
            <input
              type="text"
              name="name"
              className="mt-1 p-2 border rounded w-full"
              value={eventData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              name="date"
              className="mt-1 p-2 border rounded w-full"
              value={`${year}-${month}-${day}`}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status:</label>
            <select
              name="status"
              className="mt-1 p-2 border rounded w-full"
              value={eventData.status}
              onChange={handleInputChange}
              required
            >
              {Object.values(EventStatus).map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Event Link:</label>
            <input
              type="url"
              name="eventLink"
              className="mt-1 p-2 border rounded w-full"
              value={eventData.eventLink}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Is Virtual:
              <input
                type="checkbox"
                name="isVirtual"
                className="ml-2 "
                checked={eventData.isVirtual}
                onChange={handleInputChange}
              />
            </label>

          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <textarea
              name="description"
              rows={4} // Adjust the number of rows as needed
              className="mt-1 p-2 border rounded w-full"
              value={eventData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Location :</label>
            <input
              name="location"
              className="mt-1 p-2 border rounded w-full"
              value={eventData.location}
              onChange={handleInputChange}
            />
          </div>
          <AddImagesAndTags maxImages={1} onImagesAndTagsChange={handleChangedImage}></AddImagesAndTags>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Create Event
          </button>
        </form>
      </div>
      {notify && <Notification  message={notifyMessage} type={notifyType}></Notification>}

    </div>
  );
};

export default CreateEventForm;
