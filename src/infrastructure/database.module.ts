import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './models/transaction.model';
import { TransactionRepository } from './repositories/transaction.repository';
import { BankAccount } from './models/bank-account.model';
import { SeederService } from './services/seeders.service';

@Module({
  imports: [
    // database configuration
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: ':memory:',
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([Transaction, BankAccount]),
  ],
  providers: [SeederService, TransactionRepository],
  exports: [TransactionRepository],
})
export class DatabaseModule {}
