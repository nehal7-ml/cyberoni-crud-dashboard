/**
 * @jest-environment node
 */

import { describe, expect, test, it, beforeAll } from '@jest/globals';
import { uploadFile, deleteFile } from "@/lib/cloudinary";
import { bufferToB64 } from "@/lib/utils";

describe('Testing Cloudinary', () => {
    const testString = 'cloudinaryTest'
    const buffer = Buffer.from(testString)
    const fileUrl = bufferToB64(buffer, 'text/plain');
    let FileSrc = ''
    // ...

    it('Upload Files to cloudinary', async () => {

        const resp = await uploadFile(fileUrl);
        FileSrc = resp.secure_url
        // console.log(fileID);
        expect(resp.secure_url).toContain('https://res.cloudinary.com')

    });
    it('delete Files to cloudinary', async () => {

        const resp = await deleteFile(FileSrc.split('/').slice(-1)[0].split('.')[0]);
        expect(resp.result).toBe('ok')
    })

});
