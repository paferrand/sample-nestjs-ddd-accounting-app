import { TransactionEntity } from '../../domain/entities/transaction.entity';

export interface TransactionRepositoryInterface {
  create(transaction: TransactionEntity): Promise<TransactionEntity>;
}
