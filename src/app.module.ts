import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MorganMiddleware } from "./common/middleware/morgan.middleware";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { TransactionModule } from "./transaction/transaction.module";
import { AuthModule } from "./auth/auth.module";
import { CategoryModule } from "./category/category.module";
import { FileuploadModule } from "./fileupload/fileupload.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    TransactionModule,
    AuthModule,
    CategoryModule,
    FileuploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes("*");
  }
}
