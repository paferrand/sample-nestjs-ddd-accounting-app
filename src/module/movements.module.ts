import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MovementsService } from '../application/services/movements.service';
import { MovementsValidatorService } from '../domain/services/movements-validator.service';
import { TransactionRepository } from '../infrastructure/repositories/transaction.repository';
import { MovementsController } from '../application/controllers/movements.controller';
import { TransactionRepositoryInterface } from '../domain/repositories/transaction.repository.interface';
import { Transaction } from '../infrastructure/models/transaction.model';
import { BankAccount } from '../infrastructure/models/bank-account.model';

@Module({
  imports: [SequelizeModule.forFeature([Transaction, BankAccount])],
  controllers: [MovementsController],
  providers: [
    MovementsService,
    MovementsValidatorService,
    {
      provide: TransactionRepositoryInterface,
      useClass: TransactionRepository,
    },
  ],
  exports: [MovementsService],
})
export class MovementsModule {}
