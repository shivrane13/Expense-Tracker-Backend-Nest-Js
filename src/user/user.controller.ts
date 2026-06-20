import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import { ApiResponseUtil } from "src/common/ApiResponse";
import { FileuploadService } from "src/fileupload/fileupload.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileuploadService: FileuploadService,
  ) {}

  @Post("/create")
  async createUser(@Body() userData: CreateUserDto) {
    try {
      const data = await this.userService.createUser(userData);
      return ApiResponseUtil.created(data, "User created successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create user";
      return ApiResponseUtil.error(message);
    }
  }

  @Get("/:id")
  async getUserById(@Param("id") id: string) {
    try {
      const data = await this.userService.getUserById(Number(id));
      return ApiResponseUtil.success(data, "User fetched successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch user";
      return ApiResponseUtil.error(message);
    }
  }

  @Post("/read")
  async getAllUsers() {
    try {
      const data = await this.userService.getAllUsers();
      return ApiResponseUtil.success(data, "Users fetched successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch users";
      return ApiResponseUtil.error(message);
    }
  }

  @Post("/readPgn")
  async getUserByPgn(
    @Body()
    filters: {
      searchTitle: string;
      page: number;
      limit: number;
    },
  ) {
    try {
      const data = await this.userService.getUserByPgn(filters);
      return ApiResponseUtil.success(data, "Users fetched successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch users";
      return ApiResponseUtil.error(message);
    }
  }

  @Post("/update")
  async updateUser(@Body() userData: UpdateUserDto) {
    try {
      const data = await this.userService.updateUser(userData);
      return ApiResponseUtil.success(data, "User updated successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update user";
      return ApiResponseUtil.error(message);
    }
  }

  @Post("/delete")
  async deleteUser(@Body("id") id: number) {
    try {
      const data = await this.userService.deleteUser(id);
      return ApiResponseUtil.success(data, "User deleted successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete user";
      return ApiResponseUtil.error(message);
    }
  }

  @Post("/uploadProfileImage")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Body("id") id: number,
  ) {
    try {
      const isUserExist = await this.userService.getUserById(Number(id));
      if (!isUserExist) {
        return ApiResponseUtil.error("User not found");
      }
      const fileUrl = await this.fileuploadService.uploadFile(file);
      id = Number(id);
      const updatedUser = await this.userService.updateUserProfileImage(
        id,
        fileUrl,
      );
      return ApiResponseUtil.success(updatedUser, "File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      return ApiResponseUtil.error(
        error instanceof Error ? error.message : "Failed to upload file",
      );
    }
  }
}
