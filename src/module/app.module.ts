import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database.module';
import { ConfigModule } from '@nestjs/config';
import { MovementsModule } from './movements.module';
import { TaxesModule } from './taxes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // grant process.env access through the whole application
    }),
    DatabaseModule,
    MovementsModule,
    TaxesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
