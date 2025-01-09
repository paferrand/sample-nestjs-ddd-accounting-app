import { BalanceEntity } from '../entities/balance.entity';
import { TransactionEntity } from '../entities/transaction.entity';
import { BalanceComparison } from './interfaces/movements-validator.interfaces';

/**
 * `MovementsValidatorService` is a domain class that performs validation of banking operations
 * and balances. It ensures that:
 * - Transactions are not duplicated.
 * - The calculated sum of transactions aligns with the provided balances.
 */
export class MovementsValidatorService {
  /**
   * Validates transactions and balances by checking:
   * 1. Duplicated transactions.
   * 2. Mismatched balances.
   *
   * @param transactions - Array of TransactionEntity
   * @param balances - Array of BalanceEntity
   * @throws {Error} When input parameters are invalid
   * @returns An object indicating whether the data is valid and detailing any invalid transactions or balances
   */
  checkMovements(transactions: TransactionEntity[], balances: BalanceEntity[]): Map<BalanceEntity, BalanceComparison> {
    this.validateInputs(transactions, balances);

    // 1. Sort balances and transactions
    const sortedBalances = balances.sort((a: BalanceEntity, b: BalanceEntity) => a.date.getTime() - b.date.getTime());
    const sortedTransactions = transactions.sort(
      (a: TransactionEntity, b: TransactionEntity) => a.date.getTime() - b.date.getTime(),
    );

    // 2. Init the Map of comparisons for each balance
    const balanceComparisons = new Map<BalanceEntity, BalanceComparison>();
    sortedBalances.forEach((balance) => {
      balanceComparisons.set(balance, {
        startDate: balance.date,
        endDate: null,
        expectedAmount: null,
        providedAmount: balance.amount,
        difference: 0,
        isValid: false,
        duplicatedTransactions: [],
        transactions: [],
      });
    });

    // 3. Process transactions, find duplicates and compares expected amounts and provided balance amounts
    const processedTransactions = new Set<string>();
    sortedTransactions.forEach((transaction) => {
      const currentBalance = this.findCurrentBalance(sortedBalances, transaction.date);
      if (!currentBalance) return;

      const balanceComparison = balanceComparisons.get(currentBalance);
      const nextBalance = sortedBalances[sortedBalances.indexOf(currentBalance) + 1];

      if (processedTransactions.has(transaction.uniqid)) {
        balanceComparison.duplicatedTransactions.push(transaction);
      } else {
        balanceComparison.transactions.push(transaction);
        balanceComparison.providedAmount += transaction.isPayin() ? transaction.amount : -transaction.amount;
        processedTransactions.add(transaction.uniqid);
      }

      balanceComparison.expectedAmount = nextBalance ? nextBalance.amount : balanceComparison.expectedAmount;
      balanceComparison.difference = balanceComparison.expectedAmount - balanceComparison.providedAmount;
      balanceComparison.isValid = nextBalance && balanceComparison.expectedAmount === balanceComparison.providedAmount;
      balanceComparison.endDate = nextBalance ? nextBalance.date : balanceComparison.endDate;
    });

    return balanceComparisons;
  }

  /**
   * Validates fields before checking movememnts
   *
   * @param transactions - Array of `TransactionEntity`
   * @param balances - Array of `BalanceEntity`
   * @throws {Error} When input parameters are invalid
   * @returns void
   */
  private validateInputs(transactions: TransactionEntity[], balances: BalanceEntity[]): void {
    if (!Array.isArray(transactions) || !Array.isArray(balances)) {
      throw new Error('Invalid input: transactions and balances must be arrays');
    }

    if (transactions.length === 0) {
      throw new Error('No transactions provided for validation');
    }

    if (!balances.length) {
      throw new Error('No balances provided for validation');
    }
  }

  private findCurrentBalance(balances: BalanceEntity[], date: Date): BalanceEntity | undefined {
    return balances.find((balance, index) => {
      const nextBalance = balances[index + 1];
      return balance.date.getTime() <= date.getTime() && (!nextBalance || nextBalance.date.getTime() > date.getTime());
    });
  }
}
