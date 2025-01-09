import { Injectable } from '@nestjs/common';
import { MovementsValidatorService } from '../../domain/services/movements-validator.service';
import { BalanceDTO } from '../dto/balance.dto';
import { MovementsDTO } from '../dto/movements.dto';
import { TransactionDTO } from '../dto/transaction.dto';

import { TransactionRepositoryInterface } from '../../domain/repositories/transaction.repository.interface';

@Injectable()
/**
 * `MovementsService` is an application service class responsible for
 * validating the movements (transactions and balances) using the domain
 * service `MovementsValidatorService`.
 */
export class MovementsService {
  /**
   * Creates an instance of MovementsService.
   *
   * @param movementsValidatorService - The domain service for validating movements.
   * @param transactionRepository - The transaction repository for manipulating data.
   */
  constructor(
    private readonly movementsValidatorService: MovementsValidatorService,
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  /**
   * Validates the provided movements.
   *
   * @param movementsDTO - The DTO containing transactions and balances to be validated.
   * @returns The validation result including duplicated transactions and invalid balances
   */
  validateMovements(movementsDTO: MovementsDTO) {
    return this.movementsValidatorService.checkMovements(
      TransactionDTO.toEntities(movementsDTO.transactions),
      BalanceDTO.toEntities(movementsDTO.balances),
    );
  }

  /**
   * Asks Saving of a list of transactions to the transactionRepository
   *
   * @param transactionsDTO - The DTO containing transactions
   * @returns `void`
   */
  async saveTransactions(transactionsDTO: TransactionDTO[]) {
    await this.transactionRepository.createTransactions(TransactionDTO.toEntities(transactionsDTO));
  }
}
