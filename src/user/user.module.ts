import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { FileuploadModule } from "src/fileupload/fileupload.module";

@Module({
  imports: [PrismaModule, FileuploadModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
