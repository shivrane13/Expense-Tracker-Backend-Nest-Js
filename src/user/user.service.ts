import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import { User } from "generated/prisma/client";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const isAlreadyExist = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: userData.email }, { mobile: userData.mobile }],
        },
      });
      if (isAlreadyExist) {
        throw new Error("User with this email or mobile already exists");
      }
      const user = await this.prisma.user.create({
        data: userData,
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRowUserById(id: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          img: true,
          dailyBudget: true,
          createdAt: true,
          _count: {
            select: {
              transactions: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return { ...user, transactionsCount: user._count.transactions || 0 };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          img: true,
        },
      });
      return users;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getUserByPgn(filters: {
    searchTitle: string;
    page: number;
    limit: number;
  }) {
    try {
      const query = {};
      if (filters.searchTitle) {
        query["OR"] = [
          {
            name: {
              contains: filters.searchTitle,
              mode: "insensitive",
            },
          },
          {
            mobile: {
              contains: filters.searchTitle,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: filters.searchTitle,
              mode: "insensitive",
            },
          },
        ];
      }
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const [data, count] = await Promise.all([
        this.prisma.user.findMany({
          where: query,
          skip: skip,
          take: limit,
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
            img: true,
            dailyBudget: true,
          },
        }),
        this.prisma.user.count({ where: query }),
      ]);

      if (data.length === 0) {
        throw new Error("No users found");
      }

      return {
        data,
        total: count,
        numberOfPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateUser(userData: UpdateUserDto): Promise<User> {
    try {
      const isAlreadyExist = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: userData.email }, { mobile: userData.mobile }],
          AND: [{ id: { not: userData.id } }],
        },
      });

      if (isAlreadyExist) {
        throw new Error("User with this email or mobile already exists");
      }
      const user = await this.prisma.user.update({
        where: { id: userData.id },
        data: userData,
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getUserByMobile(mobile: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { mobile },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateUserProfileImage(id: number, imgUrl: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { img: imgUrl },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
