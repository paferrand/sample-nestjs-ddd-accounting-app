import { BalanceDTO } from './balance.dto';
import { TransactionDTO } from './transaction.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class MovementsDTO {
  @ValidateNested({ each: true })
  @Type(() => TransactionDTO)
  transactions: TransactionDTO[];
  @ValidateNested({ each: true })
  @Type(() => BalanceDTO)
  balances: BalanceDTO[];
}
