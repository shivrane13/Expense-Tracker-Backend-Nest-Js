import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiResponseUtil } from "src/common/ApiResponse";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginData: { mobile: string; password: string }) {
    try {
      const data = await this.authService.login(
        loginData.mobile,
        loginData.password,
      );
      return ApiResponseUtil.success(data, "Login successful");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during login.";
      return ApiResponseUtil.error(message);
    }
  }
}
