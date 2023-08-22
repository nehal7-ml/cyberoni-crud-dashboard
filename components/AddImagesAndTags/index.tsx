import { createImageDTO } from "@/crud/images";
import { createTagDTO } from "@/crud/tags";
import React, { useState } from 'react';


type AddImagesAndTagsProps = {
  onImagesAndTagsChange: (images: createImageDTO[], tags: createTagDTO[]) => void;
};

const AddImagesAndTags: React.FC<AddImagesAndTagsProps> = ({ onImagesAndTagsChange }) => {
  const [images, setImages] = useState<createImageDTO[]>([]);
  const [tags, setTags] = useState<createTagDTO[]>([]);
  const [newImageSrc, setNewImageSrc] = useState('');
  const [newTagName, setNewTagName] = useState('');

  const handleAddImage = () => {
    if (newImageSrc) {
      setImages(prevImages => [...prevImages, { src: newImageSrc }]);
      setNewImageSrc('');
    }
  };

  const handleAddTag = () => {
    if (newTagName) {
      setTags(prevTags => [...prevTags, { name: newTagName }]);
      setNewTagName('');
    }
  };

  const handleImagesAndTagsChange = () => {
    onImagesAndTagsChange(images, tags);
  };

  const handleRemoveTag = (tagToRemove: createTagDTO) => {
    setTags(prevTags => prevTags.filter(tag => tag.name !== tagToRemove.name));
  };
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Add Images</h2>
      <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {images.map(image => (
          <div
            key={image.src}
            className="bg-gray-200 p-2 rounded"
          >
            <img src={image.src} alt="Product" className="w-20 h-20 object-cover" />
          </div>
        ))}
      </div>
        <input
          type="text"
          className="p-2 border rounded w-full"
          placeholder="Image URL"
          value={newImageSrc}
          onChange={e => setNewImageSrc(e.target.value)}
        />
        <button
          type="button"
          className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={handleAddImage}
        >
          Add Image
        </button>
      </div>
      <h2 className="text-lg font-semibold mb-2">Add Tags</h2>
      <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <div
            key={tag.name}
            className="bg-blue-200 text-blue-800 p-2 rounded flex items-center"
          >
            <span>{tag.name}</span>
            <button
              type="button"
              className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring focus:ring-red-300"
              onClick={() => handleRemoveTag(tag)}
            >
              X
            </button>
          </div>
        ))}
      </div>
        <input
          type="text"
          className="p-2 border rounded w-full"
          placeholder="Tag Name"
          value={newTagName}
          onChange={e => setNewTagName(e.target.value)}
        />
        <button
          type="button"
          className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={handleAddTag}
        >
          Add Tag
        </button>
      </div>    

    </div>
  );
};

export default AddImagesAndTags;
