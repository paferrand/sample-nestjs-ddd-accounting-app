import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from '../models/transaction.model';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { TransactionRepositoryInterface } from '../../domain/repositories/transaction.repository.interface';

@Injectable()
export class TransactionRepository implements TransactionRepositoryInterface {
  constructor(
    @InjectModel(Transaction)
    private transactionModel: typeof Transaction,
  ) {}

  async createTransactions(transactions: TransactionEntity[]): Promise<void> {
    await this.transactionModel.bulkCreate(transactions);
  }

  async create(transaction: TransactionEntity): Promise<TransactionEntity> {
    const newTransaction = await this.transactionModel.create(transaction);
    return new TransactionEntity(
      newTransaction.date,
      newTransaction.amount,
      newTransaction.vatRate,
      newTransaction.description,
      newTransaction.type,
      newTransaction.bankAccountId,
    );
  }
}
