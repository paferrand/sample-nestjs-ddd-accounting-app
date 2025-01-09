import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { MovementsService } from '../services/movements.service';
import { MovementsDTO } from '../dto/movements.dto';

/**
 * `MovementsController` handles HTTP requests related to movements.
 */
@Controller('movements')
export class MovementsController {
  /**
   * Injects the MovementsService.
   * @param movementsService.
   */
  constructor(private readonly movementsService: MovementsService) {}

  /**
   * Validation of movements Endpoint
   * use as POST Query
   *
   * @param movementsDto - The DTO containing movements.
   * @returns A JSON string indicating the validation status.
   * @throws HttpException if the input is invalid or movements are invalid.
   */
  @Post('validation')
  validateMovements(@Body() movementsDto: MovementsDTO): string {
    if (!movementsDto || !movementsDto.transactions || !movementsDto.balances) {
      throw new HttpException('Bad Request: Missing parameters', HttpStatus.BAD_REQUEST);
    }

    const validatedMovements = this.movementsService.validateMovements(movementsDto);

    if (Array.from(validatedMovements.values()).some((balanceComparison) => !balanceComparison.isValid)) {
      throw new HttpException(
        {
          message: 'Warning, Movements provided are invalid, please refer to the reasons below.',
          reasons: Array.from(validatedMovements.values()),
        },
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    return JSON.stringify({
      message: 'Accepted',
    });
  }

  /**
   * Save movements if validation succeeds.
   * use as POST query
   * @param movementsDto - The DTO containing movements.
   * @returns A JSON string indicating the save status.
   * @throws HttpException if the input is invalid or movements are invalid.
   */
  @Post('save')
  async saveMovements(@Body() movementsDto: MovementsDTO): Promise<string> {
    if (!movementsDto || !movementsDto.transactions || movementsDto.balances === undefined) {
      throw new HttpException('Bad Request: Missing parameters', HttpStatus.BAD_REQUEST);
    }

    const validatedMovements = this.movementsService.validateMovements(movementsDto);
    if (Array.from(validatedMovements.values()).some((balanceComparison) => !balanceComparison.isValid)) {
      throw new HttpException(
        {
          message: 'Warning, Movements provided are invalid, please refer to the reasons below.',
          // reasons: validatedMovements.invalidation,
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    try {
      await this.movementsService.saveTransactions(movementsDto.transactions);

      return JSON.stringify({
        message: 'Transactions successfully saved',
      });
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error while saving transactions',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
