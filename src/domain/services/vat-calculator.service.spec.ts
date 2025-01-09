import { VatCalculatorService } from './vat-calculator.service';
import { TransactionEntity } from '../entities/transaction.entity';
import { vatAmountsToTransactionsDataset, vatAmountsFromTransactionsDataset } from './datasets/vat-calculator.dataset';
import { VatRate } from './enums/vat-calculator.enums';
import { TransactionDTO } from '../../application/dto/transaction.dto';

describe('VatCalculatorService', () => {
  let vatCalculator: VatCalculatorService;

  beforeEach(() => {
    vatCalculator = new VatCalculatorService();
  });

  describe('setVatAmountsToTransactions', () => {
    it('should set VAT amounts and net of taxes amounts for transactions', () => {
      const { transactions, expectedTransactions } = vatAmountsToTransactionsDataset;
      const tr = TransactionDTO.toEntities(transactions);

      const result = vatCalculator.setVatAmountsToTransactions(tr);

      expectedTransactions.forEach((expectedTransaction) => {
        const providedTransaction = result.shift();
        expect(providedTransaction.amount).toEqual(expectedTransaction.amount);
        expect(providedTransaction.amountNetOfTaxes).toEqual(expectedTransaction.amountNetOfTaxes);
        expect(providedTransaction.vatAmount).toEqual(expectedTransaction.vatAmount);
      });
    });
  });

  describe('calculateVatAmountsFromTransactions', () => {
    it('should calculate total VAT amounts for Payin and Payout transactions', () => {
      const { transactions, expectedVatAmounts } = vatAmountsFromTransactionsDataset;
      const transactionEntities = transactions.map((dto) => {
        const transactionEntity = TransactionDTO.toEntity(dto);
        transactionEntity.vatAmount = dto.vatAmount;
        return transactionEntity;
      });

      const result = vatCalculator.calculateVatAmountsFromTransactions(transactionEntities);

      expect(result).toEqual(expectedVatAmounts);
    });

    it('should return zero VAT amounts if no transactions are provided', () => {
      const transactions: TransactionEntity[] = [];

      const expectedVatAmounts = {
        vatPayinAmount: 0,
        vatPayoutAmount: 0,
        vatToCollectAmount: 0,
      };

      const transactionEntities = transactions.map((dto) => TransactionDTO.toEntity(dto));

      const result = vatCalculator.calculateVatAmountsFromTransactions(transactionEntities);

      expect(result).toEqual(expectedVatAmounts);
    });
  });

  describe('calculateVatAmountFromAtiAmountAndVatRate', () => {
    it('should calculate the correct VAT amount for a given ATI amount and VAT rate', () => {
      const atiAmount = 120;
      const vatRate = VatRate.normal;
      const expectedVatAmount = 20;

      const result = VatCalculatorService.calculateVatAmountFromAtiAmountAndVatRate(atiAmount, vatRate);

      expect(result).toBe(expectedVatAmount);
    });

    it('should return 0 VAT if VAT rate is 0%', () => {
      const atiAmount = 100;
      const vatRate = VatRate.none;
      const expectedVatAmount = 0;

      const result = VatCalculatorService.calculateVatAmountFromAtiAmountAndVatRate(atiAmount, vatRate);

      expect(result).toBe(expectedVatAmount);
    });

    it('should calculate VAT amount from Vat Rate and ATI Amount', () => {
      const atiAmount = 100;
      const vatRate = VatRate.reduce;
      const expectedVatAmount = 5.21;

      const result = VatCalculatorService.calculateVatAmountFromAtiAmountAndVatRate(atiAmount, vatRate);

      expect(result).toBe(expectedVatAmount);
    });
  });

  describe('sum', () => {
    it('should return the sum of two rounded amounts', () => {
      const a = 11.3456;
      const b = 22.6789;
      const expectedSum = 34.02;

      const result = VatCalculatorService.sum(a, b);

      expect(result).toBe(expectedSum);
    });

    it('should handle summing negative numbers', () => {
      const a = -10.2;
      const b = -5.8;
      const expectedSum = -16;

      const result = VatCalculatorService.sum(a, b);

      expect(result).toBe(expectedSum);
    });
  });

  describe('roundAmount', () => {
    it('should round a number to two decimal places', () => {
      const input = 12.3456;
      const expectedRounded = 12.35;

      const result = VatCalculatorService.roundAmount(input);

      expect(result).toBe(expectedRounded);
    });

    it('should round down correctly', () => {
      const input = 10.1234;
      const expectedRounded = 10.12;

      const result = VatCalculatorService.roundAmount(input);

      expect(result).toBe(expectedRounded);
    });

    it('should handle numbers with fewer than two decimal places', () => {
      const input = 7;
      const expectedRounded = 7;

      const result = VatCalculatorService.roundAmount(input);

      expect(result).toBe(expectedRounded);
    });
  });
});
