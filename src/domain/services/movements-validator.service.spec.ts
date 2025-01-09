import { MovementsValidatorService } from './movements-validator.service';
import { MovementsValidatorDataset } from './datasets/movements-validator.dataset';
import { TransactionDTO } from '../../application/dto/transaction.dto';

describe('MovementsValidator', () => {
  let validator: MovementsValidatorService;

  beforeEach(() => {
    validator = new MovementsValidatorService();
  });

  describe('checkMovements', () => {
    MovementsValidatorDataset.forEach((movementValidatorDataset) => {
      const { description, transactions, balances, expected } = movementValidatorDataset;
      it(description, () => {
        const movements = validator.checkMovements(TransactionDTO.toEntities(transactions), balances);

        movements.forEach((balanceComparison) => {
          const balanceComparisonExpected = expected.shift();

          expect(balanceComparison.isValid).toEqual(balanceComparisonExpected.isValid);
          expect(balanceComparison.difference).toEqual(balanceComparisonExpected.difference);
          expect(balanceComparison.expectedAmount).toEqual(balanceComparisonExpected.expectedAmount);
          expect(balanceComparison.providedAmount).toEqual(balanceComparisonExpected.providedAmount);
          expect(balanceComparison.duplicatedTransactions.length).toEqual(
            balanceComparisonExpected.duplicatedTransactions.length,
          );
        });
      });
    });
  });
});
