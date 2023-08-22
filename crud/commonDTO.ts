import { Event, GptPrompt, Service } from "@prisma/client";
import { displayBlogDTO } from "./blog";
import { displayProductDTO } from "./product";
import { displayUserDTO } from "./user";

export type getAllRecordsDTO = {
    records:  displayUserDTO[] |  displayProductDTO[] | displayBlogDTO[] | Service[] | Event[] | GptPrompt[]  ;
    currentPage: number,
    totalPages: number;
    pageSize: number;
}