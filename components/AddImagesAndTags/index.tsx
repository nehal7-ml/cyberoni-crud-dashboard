import { createImageDTO } from "@/crud/images";
import { createTagDTO } from "@/crud/tags";
import React, { useState } from 'react';
import AddImage from "./AddImage";
import AddTags from "./AddTags";


type AddImagesAndTagsProps = {
  maxImages?: number,
  onImagesAndTagsChange: (images: createImageDTO[], tags: createTagDTO[]) => void;
  images?: createImageDTO[];
  tags?: createTagDTO[];  
};

const AddImagesAndTags: React.FC<AddImagesAndTagsProps> = ({ onImagesAndTagsChange, maxImages, images, tags }) => {

  function onImageChange(images: createImageDTO[]) {

    onImagesAndTagsChange(images, [])
  }
  function onTagsChange(tags: createTagDTO[]) {
    onImagesAndTagsChange([], tags)
  }

  return (
    <div>
      <AddImage defaultImages={images} onImagesChange={onImageChange} maxImages={maxImages} ></AddImage>
      <AddTags  defaultTags={tags} onTagsChange={onTagsChange} ></AddTags>
    </div>
  );
};

export default AddImagesAndTags;
