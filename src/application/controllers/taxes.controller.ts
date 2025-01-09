import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsDTO } from '../dto/transaction.dto';
import { VatService } from '../services/vat.service';

/**
 * `TaxesController` handles HTTP requests related to taxes like vat calculation.
 */
@Controller('taxes')
export class TaxesController {
  /**
   * Injects the vatService.
   * @param vatService.
   */
  constructor(private readonly vatService: VatService) {}

  /**
   * endpoint to calculate Vat from a transaction list
   * use as POST Query
   *
   * @param transactionsDTO - The DTO containing transactions.
   * @returns A JSON string indicating the VAT amounts to declare to the Tax Services.
   * @throws HttpException if the input is invalid or movements are invalid.
   */
  @Post('vat')
  calculateVat(@Body() transactionsDTO: TransactionsDTO): string {
    if (!transactionsDTO) {
      throw new HttpException(
        'Bad Request: Missing parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    const vatAmounts = this.vatService.getVatAmounts(
      transactionsDTO.transactions,
    );

    if (!vatAmounts) {
      throw new HttpException(
        {
          message:
            'Warning, transactions provided are invalid, please refer to the reasons below.',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return JSON.stringify({
      message: `See below the VAT amount to declare to Tax services`,
      vatAmounts: vatAmounts,
    });
  }
}
