import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HrAddressService } from './hr-address.service';
import { HrAddressHandler } from './hr-address.handler';
import { HrAddressController } from './hr-address.controller';
import { HrAddress, HrAddressSchema } from './entities/hr-address.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HrAddress.name, schema: HrAddressSchema },
    ]),
  ],
  controllers: [HrAddressController],
  providers: [HrAddressService, HrAddressHandler],
  exports: [HrAddressService],
})
export class HrAddressModule {}
