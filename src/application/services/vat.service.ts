import { Injectable } from '@nestjs/common';
import { TransactionDTO } from '../dto/transaction.dto';
import { VatCalculatorService } from '../../domain/services/vat-calculator.service';

@Injectable()
/**
 * `VatService` is an application service class responsible for
 * working with the transactions and VAT amounts, using the domain vatCalculatorService
 */
export class VatService {
  /**
   * Creates an instance of VatService.
   *
   * @param {VatCalculatorService} vatCalculatorService - The domain service for calculating Vat amounts.
   */
  constructor(private readonly vatCalculatorService: VatCalculatorService) {}

  /**
   * get the Vat amounts from provided transactions, and calculates each VAT amounts of transactions provided
   *
   * @param transactionsDTO - The DTO of transactions.
   * @returns  The Vat Amounts calculated and the list of transactions
   */
  getVatAmounts(transactionsDTO: TransactionDTO[]) {
    const transactions = this.vatCalculatorService.setVatAmountsToTransactions(
      TransactionDTO.toEntities(transactionsDTO),
    );

    const { vatPayinAmount, vatPayoutAmount, vatToCollectAmount } =
      this.vatCalculatorService.calculateVatAmountsFromTransactions(
        transactions,
      );

    return {
      vatPayinAmount,
      vatPayoutAmount,
      vatToCollectAmount,
      transactions,
    };
  }
}
