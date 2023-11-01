import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECERET,
    secure: true
});


export async function uploadFile(file: string, type: "image" | "video" | "raw" | "auto" = 'raw') {
    const response = await cloudinary.uploader.upload(file, { resource_type: type });
    return response
}

// include file extension when raw file
export async function deleteFile(file_id: string, type: "image" | "video" | "raw" | "auto" = 'raw') {
    const response = await cloudinary.uploader.destroy(file_id, { resource_type: type });
    return response
}

export async function uploadImage(file: string) {
    const response = await cloudinary.uploader.upload(file, { resource_type: 'image' });
    return response
}

export async function deleteImage(file_id: string) {
    const response = await cloudinary.uploader.destroy(file_id, { resource_type: 'image' });
    return response
}

