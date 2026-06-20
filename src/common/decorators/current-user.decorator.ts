import { createParamDecorator } from "@nestjs/common";
import { UserRequest } from "../types/UserRequest";

export const CurrentUser = createParamDecorator((key, ctx) => {
  const request = ctx.switchToHttp().getRequest<UserRequest>();
  const user = request.user;
  return key ? user?.[key] : user;
});
