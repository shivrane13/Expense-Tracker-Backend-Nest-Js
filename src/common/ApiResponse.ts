import { HttpStatus } from "@nestjs/common";

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: any;
}

export class ApiResponseUtil {
  static success<T>(
    data: T,
    message = "Success",
    statusCode = HttpStatus.OK,
  ): ApiResponse<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static error(
    message = "Something went wrong",
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: any,
  ): ApiResponse {
    return {
      success: false,
      statusCode,
      message,
      error,
    };
  }

  static created<T>(data: T, message = "Created successfully"): ApiResponse<T> {
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message,
      data,
    };
  }

  static notFound(message = "Resource not found"): ApiResponse {
    return {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message,
    };
  }

  static badRequest(message = "Bad request"): ApiResponse {
    return {
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message,
    };
  }

  static unauthorized(message = "Unauthorized"): ApiResponse {
    return {
      success: false,
      statusCode: HttpStatus.UNAUTHORIZED,
      message,
    };
  }
}
