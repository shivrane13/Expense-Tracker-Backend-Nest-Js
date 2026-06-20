import { IsString, IsUrl } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsUrl()
  iconImg: string;

  @IsString()
  type: CategoryType;
}

enum CategoryType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}
