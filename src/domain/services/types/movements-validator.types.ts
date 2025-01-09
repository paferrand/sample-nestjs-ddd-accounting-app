import { TransactionEntity } from '../../entities/transaction.entity';
import { BalanceComparison } from '../interfaces/movements-validator.interfaces';

export type Invalidation = {
  duplicatedTransactions: TransactionEntity[];
  invalidBalances: BalanceComparison[];
};
