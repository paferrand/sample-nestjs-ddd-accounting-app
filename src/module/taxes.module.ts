import { Module } from '@nestjs/common';
import { TaxesController } from '../application/controllers/taxes.controller';
import { VatCalculatorService } from '../domain/services/vat-calculator.service';
import { VatService } from '../application/services/vat.service';

@Module({
  imports: [],
  controllers: [TaxesController],
  providers: [VatService, VatCalculatorService],
})
export class TaxesModule {}
