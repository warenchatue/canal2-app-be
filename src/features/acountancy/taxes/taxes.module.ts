import { Module } from '@nestjs/common';
import { TaxsService } from './taxes.service';
import { TaxsController } from './taxes.controller';
import { Tax, TaxSchema } from './entities/tax.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { TaxsHandler } from './taxes.handler';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tax.name, schema: TaxSchema }]),
  ],
  controllers: [TaxsController],
  providers: [TaxsService, TaxsHandler],
  exports: [TaxsService],
})
export class TaxsModule {}
