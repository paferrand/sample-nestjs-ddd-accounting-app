import { TransactionEntity } from 'src/domain/entities/transaction.entity';

export interface BalanceComparison {
  startDate: Date;
  endDate: Date;
  expectedAmount: number;
  providedAmount: number;
  difference: number;
  isValid: boolean;
  duplicatedTransactions: TransactionEntity[];
  transactions: TransactionEntity[];
}

// export interface MovementValidationResult {
//   readonly isValid: boolean;
//   readonly invalidation: Invalidation;
// }
