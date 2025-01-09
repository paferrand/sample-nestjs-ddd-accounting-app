import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator';
import { TransactionType } from '../../domain/entities/transaction.entity';
import { TransactionEntity } from '../../domain/entities/transaction.entity';

export class TransactionDTO {
  @IsDateString()
  date: Date;
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  vatRate: number;
  @IsString()
  description: string;
  @IsEnum(TransactionType)
  type: TransactionType;
  @IsString()
  @IsOptional()
  bankAccountId: string;

  static toEntity(dto: TransactionDTO): TransactionEntity {
    return new TransactionEntity(dto.date, dto.amount, dto.vatRate, dto.description, dto.type, dto.bankAccountId);
  }

  static toEntities(dtos: TransactionDTO[]): TransactionEntity[] {
    return dtos.map((dto) => TransactionDTO.toEntity(dto));
  }
}

export class TransactionsDTO {
  @ValidateNested({ each: true })
  @Type(() => TransactionDTO)
  transactions: TransactionDTO[];
}
