import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(mobile: string, password: string) {
    try {
      if(!mobile || !password) {
        throw new Error("Mobile and password are required");
      }
      const user = await this.userService.getUserByMobile(mobile);
      console.log(user);
      if (!user) {
        throw new Error("User mobile or password is not valid");
      }

      if (user.password !== password) {
        throw new Error("User mobile or password is not valid");
      }

      const payload = { id: user.id, name: user.name };
      const token = this.jwtService.sign(payload);
      return {
        user: user,
        token: token,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
}
