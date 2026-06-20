import { Module } from "@nestjs/common";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
    PrismaModule,
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
