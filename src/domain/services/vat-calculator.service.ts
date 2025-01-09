import { TransactionEntity } from '../entities/transaction.entity';
import { VatRate } from './enums/vat-calculator.enums';
import { VatAmounts } from './interfaces/vat-calcultator.interfaces';
/**
 * `VatCalculatorService` is a domain class that calculates and amounts related operations.
 * Use this domain to calculate VAT from transactions or other sources (goods for example)
 */
export class VatCalculatorService {
  /**
   * Set VAT amounts and net amounts to a list of transactions.
   * Each transaction is updated with its VAT amount and net amount (excluding VAT).
   *
   * @param transactions - Array of `TransactionEntity` objects
   * @returns Array of `TransactionEntity` with added VAT and net amount
   */
  setVatAmountsToTransactions(transactions: TransactionEntity[]): TransactionEntity[] {
    return transactions
      .filter((transaction) => transaction.type !== undefined)
      .map((transaction) => {
        const vatAmount = VatCalculatorService.calculateVatAmountFromAtiAmountAndVatRate(
          transaction.amount,
          transaction.vatRate,
        );

        transaction.vatAmount = vatAmount;
        transaction.amountNetOfTaxes = transaction.amount - vatAmount;

        return transaction;
      });
  }

  /**
   * Calculate each VAT amounts for VAT payin and VAT payout amounts and also returns the total VAT to collect,
   *
   * @param transactions - Array of `TransactionEntity` objects
   * @returns An VatAmounts object containing vat Payin Amount, vat Payout Amount, and vat To Collect
   */
  calculateVatAmountsFromTransactions(transactions: TransactionEntity[]): VatAmounts {
    const vatAmounts = transactions.reduce(
      (vatAmounts, transaction) => {
        vatAmounts.vatPayinAmount = transaction.isPayin()
          ? VatCalculatorService.sum(vatAmounts.vatPayinAmount, transaction.vatAmount)
          : vatAmounts.vatPayinAmount;

        vatAmounts.vatPayoutAmount = transaction.isPayout()
          ? VatCalculatorService.sum(vatAmounts.vatPayoutAmount, transaction.vatAmount)
          : vatAmounts.vatPayoutAmount;

        return vatAmounts;
      },
      { vatPayinAmount: 0, vatPayoutAmount: 0, vatToCollectAmount: 0 },
    );

    vatAmounts.vatToCollectAmount = VatCalculatorService.sum(vatAmounts.vatPayinAmount, -vatAmounts.vatPayoutAmount);

    return vatAmounts;
  }

  /**
   * Static method that Calculates VAT amount using the All Taxes Included amount (ATI) and the VAT rate
   * formula used : VAT amount = (ATI / (100 + VAT rate)) * VAT rate
   *
   * @param atiAmount - The all taxes included Amout
   * @param vatRate - The VAT rate to apply
   * @returns The calculated VAT amount rounded to 2 decimal
   */
  static calculateVatAmountFromAtiAmountAndVatRate(atiAmount: number, vatRate: VatRate): number {
    if (atiAmount < 0) {
      throw new Error('ATI amount cannot be negative');
    }

    if (!Object.values(VatRate).includes(vatRate)) {
      throw new Error('Invalid VAT rate');
    }

    const vatAmount = (atiAmount / (100 + vatRate)) * vatRate;
    return VatCalculatorService.roundAmount(vatAmount);
  }

  /**
   * Static method that sums two numbers rounded to 2 decimals
   *
   * @param a - First number
   * @param b - Second number
   * @returns The rounded sum of the two numbers
   */
  static sum(a: number, b: number): number {
    console.log('sum', a, b);
    return VatCalculatorService.roundAmount(a + b);
  }

  /**
   * Static method that Rounds a number to 2 decimals in order to prevent float values when using typescript number
   *
   * @param a - The number to be rounded
   * @returns The number rounded to 2 decimals
   */
  static roundAmount(a: number): number {
    return Math.round(a * 100) / 100;
  }
}
