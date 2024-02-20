import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECERET,
    secure: true
});

export type FileType = "image" | "video" | "raw" | "auto" 

export async function uploadFile(file: string, type: "image" | "video" | "raw" | "auto" = 'raw') {
    const response = await cloudinary.uploader.upload(file, { resource_type: type });
    return response
}

// include file extension when raw file
export async function deleteFile(src: string, type: "image" | "video" | "raw" | "auto" = 'raw') {

    const fileId = src.split('/').slice(-1)[0].split('.')[0]
    const response = await cloudinary.uploader.destroy(fileId, { resource_type: type });
    return response
}

export async function uploadImage(file: string) {
    const response = await cloudinary.uploader.upload(file, { resource_type: 'image' });
    return response
}

export async function deleteImage(src: string) {
    const fileId = src.split('/').slice(-1)[0].split('.')[0]
    const response = await cloudinary.uploader.destroy(fileId, { resource_type: 'image' });
    return response
}

