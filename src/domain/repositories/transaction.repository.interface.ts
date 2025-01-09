import { TransactionEntity } from '../entities/transaction.entity';

export abstract class TransactionRepositoryInterface {
  abstract createTransactions(transactions: TransactionEntity[]): Promise<void>;
  abstract create(transaction: TransactionEntity): Promise<TransactionEntity>;
}
