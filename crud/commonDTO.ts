import { CaseStudy, Event, GptPrompt, Service } from "@prisma/client";
import { CreateBlogDTO, CreateDiscountDTO, CreateEventDTO, CreateProductDTO, DisplayBlogDTO, DisplayProductDTO } from "./DTOs";
import { CreateUserDTO, DisplayUserDTO } from "./user";
import { CreateGptPromptDTO } from "./DTOs";

export type getAllRecordsDTO = {
  records:
  | DisplayUserDTO[]
  | DisplayProductDTO[]
  | DisplayBlogDTO[]
  | Service[]
  | Event[]
  | GptPrompt[]
  | CaseStudy[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
};

export type FormProps = {
  method: "POST" | "PUT";
  action: string;
  initial?:
  | CreateBlogDTO
  | CreateProductDTO
  | CreateEventDTO
  | CreateGptPromptDTO
  | CreateUserDTO
  | CreateDiscountDTO
};
