//domain definition of a Balance

export class BalanceEntity {
  date: Date;
  amount: number;
  constructor(date: Date, amount: number) {
    this.date = new Date(date);
    this.amount = amount;
  }
}
