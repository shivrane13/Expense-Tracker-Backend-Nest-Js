import { Injectable, NestMiddleware } from "@nestjs/common";
import morgan from "morgan";

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  private readonly middleware = morgan(
    ":method :url :status :res[content-length] - :response-time ms",
  );
  use(req: any, res: any, next: () => void) {
    this.middleware(req, res, next);
  }
}
