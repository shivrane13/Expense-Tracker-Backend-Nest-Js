import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRequest } from "../types/UserRequest";
import { JwtPayload } from "../types/JwtPayload";
import { UserService } from "src/user/user.service";

@Injectable()
export default class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserRequest>();
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      throw new UnauthorizedException("Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedException("Token missing");
    }

    try {
      const decoded: JwtPayload = await this.jwtService.verifyAsync(token);
      const userData = await this.userService.getRowUserById(decoded.id);
      request.user = userData;
      return true;
    } catch (error: unknown) {
      console.log(
        "JWT verification failed:",
        error instanceof Error ? error.message : error,
      );
      throw new UnauthorizedException("Invalid token");
    }
  }
}
