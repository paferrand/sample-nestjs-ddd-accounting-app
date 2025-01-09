import { VatRate } from '../enums/vat-calculator.enums';
import { TransactionType } from '../../entities/transaction.entity';
import { TransactionDTO } from 'src/application/dto/transaction.dto';

export const MovementsValidatorDataset = [
  {
    description: 'Valid transactions and balances',
    transactions: [
      {
        date: new Date('2024-11-01'),
        amount: 100,
        amountNetOfTaxes: 0,
        vatAmount: 0,
        vatRate: VatRate.normal,
        description: 'fact-01',
        type: TransactionType.Payin,
        bankAccountId: null,
      } as TransactionDTO,
      {
        date: new Date('2024-11-01'),
        amount: 50,
        amountNetOfTaxes: 0,
        vatAmount: 0,
        vatRate: VatRate.normal,
        description: 'fact-02',
        type: TransactionType.Payout,
        bankAccountId: null,
      } as TransactionDTO,
    ],
    balances: [
      { amount: 0, date: new Date('2024-10-31') },
      { amount: 50, date: new Date('2024-11-31') },
    ],
    expected: [
      {
        isValid: true,
        difference: 0,
        expectedAmount: 50,
        providedAmount: 50,
        duplicatedTransactions: [],
      },
      {
        isValid: false,
        difference: 0,
        expectedAmount: null,
        providedAmount: 50,
        duplicatedTransactions: [],
      },
    ],
  },
  {
    description: 'Valid transactions but balance mismatch',
    transactions: [
      {
        date: new Date('2024-11-01'),
        amount: 100,
        amountNetOfTaxes: 0,
        vatAmount: 0,
        vatRate: VatRate.normal,
        description: 'fact-01',
        type: TransactionType.Payin,
        bankAccountId: null,
      } as TransactionDTO,
      {
        date: new Date('2024-11-01'),
        amount: 50,
        amountNetOfTaxes: 0,
        vatAmount: 0,
        vatRate: VatRate.normal,
        description: 'fact-02',
        type: TransactionType.Payout,
        bankAccountId: null,
      } as TransactionDTO,
    ],
    balances: [
      { amount: 50, date: new Date('2024-09-31') },
      { amount: 210, date: new Date('2024-10-31') },
      { amount: 230, date: new Date('2024-11-31') },
    ],
    expected: [
      {
        isValid: false,
        difference: 0,
        expectedAmount: null,
        providedAmount: 50,
        duplicatedTransactions: [],
      },
      {
        isValid: false,
        difference: -30,
        expectedAmount: 230,
        providedAmount: 260,
        duplicatedTransactions: [],
      },
      {
        isValid: false,
        difference: 0,
        expectedAmount: null,
        providedAmount: 230,
        duplicatedTransactions: [],
      },
    ],
  },
  {
    description: 'Duplicate transactions and invalid balances',
    transactions: [
      {
        date: new Date('2024-11-01'),
        amount: 100,
        amountNetOfTaxes: 0,
        vatAmount: 0,
        vatRate: VatRate.normal,
        description: 'fact-01',
        type: TransactionType.Payin,
        bankAccountId: null,
      } as TransactionDTO,
      {
        date: new Date('2024-11-01'),
        amount: 50,
        amountNetOfTaxes: 0,
        vatAmount: 0,
        vatRate: VatRate.normal,
        description: 'fact-02',
        type: TransactionType.Payout,
        bankAccountId: null,
      } as TransactionDTO,
      {
        // duplicated transaction
        date: new Date('2024-11-01'),
        amount: 50,
        amountNetOfTaxes: 0,
        vatAmount: 0,
        vatRate: VatRate.normal,
        description: 'fact-02',
        type: TransactionType.Payout,
        bankAccountId: null,
      } as TransactionDTO,
      {
        date: new Date('2024-12-01'),
        amount: 50,
        amountNetOfTaxes: 0,
        vatAmount: 0,
        vatRate: VatRate.normal,
        description: 'fact-03',
        type: TransactionType.Payin,
        bankAccountId: null,
      } as TransactionDTO,
    ],
    balances: [
      { amount: 10, date: new Date('2024-10-31') },
      { amount: 60, date: new Date('2024-11-30') },
      { amount: 80, date: new Date('2024-12-31') }, // Invalid
    ],
    expected: [
      {
        isValid: true,
        difference: 0,
        expectedAmount: 60,
        providedAmount: 60,
        duplicatedTransactions: [
          {
            date: new Date('2024-11-01'),
            amount: 50,
            amountNetOfTaxes: 0,
            vatAmount: 0,
            vatRate: VatRate.normal,
            description: 'fact-02',
            type: TransactionType.Payout,
            bankAccountId: null,
          } as TransactionDTO,
        ],
      },
      {
        isValid: false,
        difference: -30,
        expectedAmount: 80,
        providedAmount: 110,
        duplicatedTransactions: [],
      },
      {
        isValid: false,
        difference: 0,
        expectedAmount: null,
        providedAmount: 80,
        duplicatedTransactions: [],
      },
    ],
  },
];
