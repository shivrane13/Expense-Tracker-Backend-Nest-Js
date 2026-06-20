import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    try {
      const category = await this.prismaService.category.create({
        data: data,
      });

      return category;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllCategories(type: string | null) {
    try {
      const query = {};

      if (type) {
        query["type"] = type;
      }

      const categories = await this.prismaService.category.findMany({
        where: query,
      });

      return categories;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
