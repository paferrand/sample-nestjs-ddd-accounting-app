import { VatRate } from '../enums/vat-calculator.enums';
import { TransactionEntity, TransactionType } from '../../entities/transaction.entity';

export const vatAmountsToTransactionsDataset = {
  description: 'should calculate VAT amounts and net of taxes amounts for transactions',
  transactions: [
    {
      date: new Date('2024-11-01'),
      amount: 120,
      amountNetOfTaxes: 0, // should be 100,
      vatAmount: 0, // should be 20,
      vatRate: VatRate.normal,
      description: '',
      type: TransactionType.Payin,
      bankAccountId: null,
    } as TransactionEntity,
    {
      date: new Date('2024-11-01'),
      amount: 200,
      amountNetOfTaxes: 0, // should be 181.82,
      vatAmount: 0, // should be 18.18,
      vatRate: VatRate.intermediate,
      description: '',
      type: TransactionType.Payout,
      bankAccountId: null,
    } as TransactionEntity,
  ],
  balances: [{ amount: 50, date: new Date('2024-11-04') }],
  expectedTransactions: [
    {
      date: new Date('2024-11-01'),
      amount: 120,
      amountNetOfTaxes: 100,
      vatAmount: 20,
      vatRate: VatRate.normal,
      description: '',
      type: TransactionType.Payin,
      bankAccountId: null,
    } as TransactionEntity,
    {
      date: new Date('2024-11-01'),
      amount: 200,
      amountNetOfTaxes: 181.82,
      vatAmount: 18.18,
      vatRate: VatRate.intermediate,
      description: '',
      type: TransactionType.Payout,
      bankAccountId: null,
    } as TransactionEntity,
  ],
};

export const vatAmountsFromTransactionsDataset = {
  transactions: [
    {
      date: new Date('2024-11-01'),
      amount: 120,
      amountNetOfTaxes: 0, // should be 102.86
      vatAmount: 17.14, // should be 17.14
      vatRate: VatRate.normal,
      description: '',
      type: TransactionType.Payin,
      bankAccountId: null,
    } as TransactionEntity,
    {
      date: new Date('2024-11-01'),
      amount: 100,
      amountNetOfTaxes: 0, // should be 94.79
      vatAmount: 5.21, // should be 5.21
      vatRate: VatRate.reduce,
      description: '',
      type: TransactionType.Payin,
      bankAccountId: null,
    } as TransactionEntity,
    {
      date: new Date('2024-11-01'),
      amount: 110,
      amountNetOfTaxes: 0, // should be 100.83
      vatAmount: 9.17, // should be 9.17
      vatRate: VatRate.intermediate,
      description: '',
      type: TransactionType.Payout,
      bankAccountId: null,
    } as TransactionEntity,
  ],
  expectedVatAmounts: {
    vatPayinAmount: 22.35, // should be 17.14 + 5.21
    vatPayoutAmount: 9.17, // should be 9.17
    vatToCollectAmount: 13.18, // should be vatPayinAmount - vatPayoutAmount
  },
};
