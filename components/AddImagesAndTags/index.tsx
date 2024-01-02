import { CreateImageDTO } from "@/crud/DTOs";
import { CreateTagDTO } from "@/crud/DTOs";
import React, { useState } from 'react';
import AddImage from "./AddImage";
import AddTags from "./AddTags";


type AddImagesAndTagsProps = {
  maxImages?: number,
  onImagesAndTagsChange: (images: CreateImageDTO[], tags: CreateTagDTO[]) => void;
  images?: CreateImageDTO[];
  tags?: CreateTagDTO[];  
};

const AddImagesAndTags: React.FC<AddImagesAndTagsProps> = ({ onImagesAndTagsChange, maxImages, images, tags }) => {

  function onImageChange(images: CreateImageDTO[]) {
    onImagesAndTagsChange(images,tags || [])
  }
  function onTagsChange(tags: CreateTagDTO[]) {
    onImagesAndTagsChange(images|| [], tags)
  }

  return (
    <div>
      <AddImage defaultImages={images} onImagesChange={onImageChange} maxImages={maxImages} ></AddImage>
      <AddTags  defaultTags={tags} onTagsChange={onTagsChange} ></AddTags>
    </div>
  );
};

export default AddImagesAndTags;
