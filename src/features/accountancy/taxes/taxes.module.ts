import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tax, TaxSchema } from './entities/tax.entity';
import { TaxesHandler } from './taxes.handler';
import { TaxesController } from './taxes.controller';
import { TaxesService } from './taxes.service';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tax.name, schema: TaxSchema }])],
  controllers: [TaxesController],
  providers: [TaxesService, TaxesHandler],
  exports: [TaxesService],
})
export class TaxesModule {}
