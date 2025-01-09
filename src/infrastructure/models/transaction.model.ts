import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { TransactionType } from '../../domain/entities/transaction.entity';
import { BankAccount } from './bank-account.model';

@Table
export class Transaction extends Model<Transaction> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  vatRate: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: TransactionType;

  @ForeignKey(() => BankAccount)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  bankAccountId: string;

  @BelongsTo(() => BankAccount)
  bankAccount: BankAccount;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  vatAmount: number;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  amountNetOfTaxes;
}
