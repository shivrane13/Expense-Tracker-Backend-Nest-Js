import { Injectable } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    console.log("Database url", process.env.DATABASE_URL);
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter, log: ["query", "info", "warn", "error"] });
  }

  async onModuleInit() {
    try {
      await this.$connect();

      // Simple query to verify DB connectivity
      await this.$queryRaw`SELECT 1`;

      console.log("✅ PostgreSQL connected successfully");
    } catch (error) {
      console.error("❌ PostgreSQL connection failed");
      console.error(error);

      // Stop application startup if DB is unavailable
      process.exit(1);
    }
  }
}
