import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

class BaseUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsOptional()
  @IsNumber()
  dailyBudget?: number;

  @IsOptional()
  @IsUrl()
  img?: string;
}

export class CreateUserDto extends BaseUserDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserDto extends BaseUserDto {
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  password?: string;
}
