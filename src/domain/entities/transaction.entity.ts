//domain definition of a Transaction

export enum TransactionType {
  Payin = 'payin',
  Payout = 'payout',
}

export class TransactionEntity {
  public amountNetOfTaxes: number;
  public uniqid: string;
  public vatAmount: number;
  public date: Date;
  public amount: number;
  public vatRate: number;
  public description: string;
  public type: TransactionType;
  public bankAccountId: string;

  constructor(
    date: Date,
    amount: number,
    vatRate: number,
    description: string,
    type: TransactionType,
    bankAccountId: string,
  ) {
    this.date = new Date(date);
    this.amount = amount;
    this.vatRate = vatRate;
    this.vatAmount = 0;
    this.description = description;
    this.type = type;
    this.bankAccountId = bankAccountId;
    this.uniqid = `${date}-${amount}-${vatRate}-${description}`;
  }

  public isPayin(): boolean {
    return this.type === TransactionType.Payin;
  }

  public isPayout(): boolean {
    return this.type === TransactionType.Payout;
  }
}
