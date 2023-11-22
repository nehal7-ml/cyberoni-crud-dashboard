import { CaseStudy, Event, GptPrompt, Service } from "@prisma/client";
import { DisplayBlogDTO } from "./blog";
import { displayProductDTO } from "./product";
import { displayUserDTO } from "./user";

export type getAllRecordsDTO = {
    records:  displayUserDTO[] |  displayProductDTO[] | DisplayBlogDTO[] | Service[] | Event[] | GptPrompt[] |CaseStudy[] ;
    currentPage: number,
    totalPages: number;
    pageSize: number;
}