import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from "./dto/transaction.dto";
import { Transaction, User } from "generated/prisma/browser";
import { formatDateTime } from "src/common/formatDateTime";

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(
    data: CreateTransactionDto,
    userId: number,
  ): Promise<Transaction> {
    try {
      const transaction = await this.prisma.transaction.create({
        data: { ...data, userId },
      });
      return transaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    try {
      const transaction = await this.prisma.transaction.findFirst({
        where: { id },
      });
      return transaction;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }
  }

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await this.prisma.transaction.findMany();
      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  async getTransactionsByPgn(filters: {
    searchTitle: string;
    userId: number;
    type: string;
    page: number;
    limit: number;
  }) {
    try {
      const query = {};

      if (filters.searchTitle) {
        query["OR"] = [
          {
            title: {
              contains: filters.searchTitle,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: filters.searchTitle,
              mode: "insensitive",
            },
          },
        ];
      }

      if (filters.userId) {
        query["userId"] = filters.userId;
      }

      if (filters.type) {
        query["category"] = {
          type: filters.type,
        };
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const [data, count] = await Promise.all([
        this.prisma.transaction.findMany({
          where: query,
          select: {
            id: true,
            title: true,
            amount: true,
            description: true,
            category: {
              select: {
                id: true,
                name: true,
                iconImg: true,
                type: true,
              },
            },
            createdAt: true,
          },
          skip: skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        this.prisma.transaction.count({ where: query }),
      ]);

      return {
        data: data.map((transaction) => ({
          id: transaction.id,
          title: transaction.title,
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category.name,
          iconImg: transaction.category.iconImg,
          type: transaction.category.type,
          date: formatDateTime(transaction.createdAt),
        })),
        total: count,
        numberOfPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error fetching transactions with filters:", error);
      throw error;
    }
  }

  async updateTransaction(data: UpdateTransactionDto): Promise<Transaction> {
    try {
      const transaction = await this.prisma.transaction.update({
        where: { id: data.id },
        data: { ...data },
      });
      return transaction;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }

  async deleteTransaction(id: number): Promise<Transaction> {
    try {
      const transaction = await this.prisma.transaction.delete({
        where: { id },
      });
      return transaction;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }

  async readTransactionsDashboard(userId: number) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          userId: userId,
        },
        select: {
          id: true,
          title: true,
          amount: true,
          description: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
              iconImg: true,
              type: true,
            },
          },
        },
        skip: 0,
        take: 3,
        orderBy: {
          createdAt: "desc",
        },
      });

      return transactions.map((transaction) => ({
        id: transaction.id,
        title: transaction.title,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category.name,
        iconImg: transaction.category.iconImg,
        type: transaction.category.type,
        date: formatDateTime(transaction.createdAt),
      }));
    } catch (error) {
      console.error("Error fetching transactions for dashboard:", error);
      throw error;
    }
  }

  async readDashboardSummary(filters: {
    user: User | null;
    fromDate: Date;
    toDate: Date;
  }) {
    try {
      const { user, fromDate, toDate } = filters;
      const query = {};
      let userBudget = 500;

      if (user) {
        query["userId"] = user.id;
        userBudget = user.dailyBudget || 500;
      }

      if (fromDate && toDate) {
        query["createdAt"] = {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        };

        const date1 = new Date(fromDate);
        const date2 = new Date(toDate);
        const daysDifference = Math.ceil(
          (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24),
        );

        userBudget = userBudget * daysDifference;
      } else {
        const userCreatedDate = user ? new Date(user.createdAt) : new Date();
        const currentDate = new Date();
        const dayDifference = Math.ceil(
          (currentDate.getTime() - userCreatedDate.getTime()) /
            (1000 * 3600 * 24),
        );

        userBudget = userBudget * dayDifference;
      }

      const income = await this.prisma.transaction.aggregate({
        where: {
          ...query,
          category: {
            type: "INCOME",
          },
        },
        _sum: {
          amount: true,
        },
      });

      const expense = await this.prisma.transaction.aggregate({
        where: {
          ...query,
          category: {
            type: "EXPENSE",
          },
        },
        _sum: {
          amount: true,
        },
      });
      return {
        Income: income._sum.amount || 0,
        Expenses: expense._sum.amount || 0,
        Savings: (income._sum.amount || 0) - (expense._sum.amount || 0),
        Budget:
          (((expense._sum.amount || 0) / userBudget) * 100).toFixed(2) + "%",
      };
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      throw error;
    }
  }
}
