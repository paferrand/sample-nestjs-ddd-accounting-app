import { IsNumber } from 'class-validator';
import { BalanceEntity } from '../../domain/entities/balance.entity';

export class BalanceDTO {
  date: Date;
  @IsNumber()
  amount: number;

  static toEntity(dto: BalanceDTO): BalanceEntity {
    return new BalanceEntity(dto.date, dto.amount);
  }

  static toEntities(dtos: BalanceDTO[]): BalanceEntity[] {
    return dtos.map((dto) => BalanceDTO.toEntity(dto));
  }
}
