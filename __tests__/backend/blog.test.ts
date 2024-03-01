/**
 * @jest-environment node
 */

import { describe, expect, test, it } from '@jest/globals';
import { prisma } from "@/lib/prisma";
import { create, remove, update, } from "@/crud/blog";
import { CreateBlogDTO, CreateImageDTO, CreateTagDTO } from "@/crud/DTOs";
import { Blog } from "@prisma/client";

describe('Testing Service crud unit functions', () => {
    const mockBlog: CreateBlogDTO = {
        title: 'Test title',
        content: 'testcontent',
        description: 'test  description',
        date: new Date(),
        featured: false,
        subTitle: 'preview',
        publishDate: new Date(),
        author: {
            email: 'nehal.sk.99@gmail.com'
        },
        tags: [
            { name: 'Tech' },
            { name: 'Mobile' },
        ] as CreateTagDTO[],
        images: [
            { name: 'Image 1', src: 'image1.jpg' } as CreateImageDTO,
            { name: 'Image 2', src: 'image2.jpg' } as CreateImageDTO,
        ],
    };

    let createdBlog: Blog;


    it('should successfully create a blog', async () => {
        const resp = await create(mockBlog, prisma);
        createdBlog = resp

        //console.log(resp);
        expect(resp.title).toBe(mockBlog.title);
        expect(resp.tags.length).toBe(resp.tags.length);

    }, 10000);

    it('should successfully update a blog tags', async () => {
        const resp = await update(createdBlog.id, {
            ...mockBlog,
            tags: [{ name: 'Mobile' }, { name: 'update' }]
        }, prisma);
        //console.log(resp);
        expect(resp.title).toBe(mockBlog.title);
        const tagNames = [{ name: 'Mobile' }, { name: 'update' }].map(tag => tag.name);

        // Filter tagsWithIds to contain only tags with names present in tagNames
        const filteredTags = resp.tags.filter(tag => tagNames.includes(tag.name));

        const tagsMatch =filteredTags.length === tagNames.length;
        expect(tagsMatch).toBeTruthy();

    }, 20000);
    it('should successfully remove a blog', async () => {
        const resp = await remove(createdBlog.id, prisma);
        //console.log(resp);
        expect(resp).toBe(undefined);
    },10000);





});
