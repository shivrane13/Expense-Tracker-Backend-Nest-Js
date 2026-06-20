import { Body, Controller, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ApiResponseUtil } from "src/common/ApiResponse";
import { CreateCategoryDto } from "./dto/category.dto";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post("/create")
  async createCategory(@Body() data: CreateCategoryDto) {
    try {
      const category = await this.categoryService.createCategory(data);
      return ApiResponseUtil.created(category, "Category created successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return ApiResponseUtil.error(message);
    }
  }

  @Post("/read")
  async getAllCategories(@Body("type") type: string | null) {
    try {
      const categories = await this.categoryService.getAllCategories(type);
      return ApiResponseUtil.success(
        categories,
        "Categories retrieved successfully",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return ApiResponseUtil.error(message);
    }
  }
}
