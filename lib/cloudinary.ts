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
export async function deleteFile(url: string) {

    const fileId = url.split('/').slice(-1)[0].split('.')[0];
    // Extract the file name from the URL
    const fileTypeRegex = /\/([^/]+)\/upload\//i;

    // Extract the file type from the URL using regular expression
    const matches = url.match(fileTypeRegex);
    const fileType = matches ? matches[1] : 'unknown';
    const response = await cloudinary.uploader.destroy(fileId, { resource_type: fileType });
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

