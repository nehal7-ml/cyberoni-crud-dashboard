import { createImageDTO } from "@/crud/images";
import { createTagDTO } from "@/crud/tags";
import React, { useState } from 'react';
import AddImage from "./AddImage";
import AddTags from "./AddTags";


type AddImagesAndTagsProps = {
  maxImages?: number,
  onImagesAndTagsChange: (images: createImageDTO[], tags: createTagDTO[]) => void;
};

const AddImagesAndTags: React.FC<AddImagesAndTagsProps> = ({ onImagesAndTagsChange, maxImages }) => {

  function onImageChange(images: createImageDTO[]) {

    onImagesAndTagsChange(images, [])
  }
  function onTagsChange(tags: createTagDTO[]) {
    onImagesAndTagsChange([], tags)
  }




  return (
    <div>
      <AddImage onImagesChange={onImageChange} maxImages={maxImages} ></AddImage>
      <AddTags onTagsChange={onTagsChange} ></AddTags>
    </div>
  );
};

export default AddImagesAndTags;
