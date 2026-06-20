import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiResponseUtil } from "src/common/ApiResponse";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from "./dto/transaction.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { TransactionService } from "./transaction.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { User } from "generated/prisma/client";

@Controller("transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Auth()
  @Post("/create")
  async createTransaction(
    @Body() data: CreateTransactionDto,
    @CurrentUser("id") id: number,
  ) {
    try {
      console.log(
        "Received data for creating transaction:",
        data,
        "User ID:",
        id,
      );
      const transaction = await this.transactionService.createTransaction(
        data,
        id,
      );
      return ApiResponseUtil.created(
        transaction,
        "Transaction created successfully",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error creating transaction:", message);
      return ApiResponseUtil.error(message);
    }
  }

  @Auth()
  @Get("/:id")
  async getTransactionById(@Param("id") id: string) {
    try {
      const transaction = await this.transactionService.getTransactionById(
        Number(id),
      );
      return ApiResponseUtil.success(
        transaction,
        "Transaction retrieved successfully",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error retrieving transaction:", message);
      return ApiResponseUtil.error(message);
    }
  }

  @Auth()
  @Post("/read")
  async getAllTransactions() {
    try {
      const transactions = await this.transactionService.getAllTransactions();
      return ApiResponseUtil.success(
        transactions,
        "Transactions retrieved successfully",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error retrieving transactions:", message);
      return ApiResponseUtil.error(message);
    }
  }

  @Auth()
  @Post("/readPgn")
  async getTransactionsByPgn(
    @Body()
    data: {
      searchTitle: string;
      type: string;
      page: number;
      limit: number;
    },
    @CurrentUser("id") id: number,
  ) {
    try {
      const transactions = await this.transactionService.getTransactionsByPgn({
        searchTitle: data.searchTitle,
        type: data.type,
        userId: id,
        page: data.page,
        limit: data.limit,
      });
      return ApiResponseUtil.success(
        transactions,
        "Transactions retrieved successfully",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error retrieving transactions with pagination:", message);
      return ApiResponseUtil.error(message);
    }
  }

  @Auth()
  @Post("/update")
  async updateTransaction(@Body() data: UpdateTransactionDto) {
    try {
      const transaction = await this.transactionService.updateTransaction(data);
      return ApiResponseUtil.success(
        transaction,
        "Transaction updated successfully",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error updating transaction:", message);
      return ApiResponseUtil.error(message);
    }
  }

  @Auth()
  @Post("/delete")
  async deleteTransaction(@Body("id") id: string) {
    try {
      const transaction = await this.transactionService.deleteTransaction(
        Number(id),
      );
      return ApiResponseUtil.success(
        transaction,
        "Transaction deleted successfully",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error deleting transaction:", message);
      return ApiResponseUtil.error(message);
    }
  }

  @Auth()
  @Post("/dashboardList")
  async readTransactionsDashboard(@CurrentUser("id") id: number) {
    try {
      const dashboardData =
        await this.transactionService.readTransactionsDashboard(id);
      return ApiResponseUtil.success(
        dashboardData,
        "Dashboard data retrieved successfully",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error retrieving dashboard data:", message);
      return ApiResponseUtil.error(message);
    }
  }

  @Auth()
  @Post("/dashboardSummary")
  async readDashboardSummary(
    @CurrentUser() user: User | null,
    @Body() filters: { fromDate: Date; toDate: Date },
  ) {
    try {
      const data = await this.transactionService.readDashboardSummary({
        user,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });
      return ApiResponseUtil.success(
        data,
        "Dashboard summary retrieved successfully",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error retrieving dashboard summary:", message);
      return ApiResponseUtil.error(message);
    }
  }
}
