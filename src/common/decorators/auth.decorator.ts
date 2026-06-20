import { applyDecorators, UseGuards } from "@nestjs/common";
import JwtAuthGuard from "../guards/auth";

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
