import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

class TransactionBaseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}

export class CreateTransactionDto extends TransactionBaseDto {}

export class UpdateTransactionDto extends TransactionBaseDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
