import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BankAccount } from '../models/bank-account.model';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(@InjectModel(BankAccount) private bankAccountModel) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    await this.seedBankAccounts();
  }

  async seedBankAccounts() {
    const bankAccounts = await this.bankAccountModel.findAll();

    const seedDataPath = process.env.SEED_DATA_PATH;
    const seedData = JSON.parse(
      fs.readFileSync(path.join(seedDataPath, 'bank-accounts.json'), 'utf8'),
    );

    if (bankAccounts.length === 0) {
      await this.bankAccountModel.bulkCreate(seedData);
    }
  }
}
