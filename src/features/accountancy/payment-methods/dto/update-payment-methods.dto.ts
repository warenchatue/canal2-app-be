import { OmitType } from '@nestjs/swagger';
import { CreatePaymentMethodDto } from './create-payment-methods.dto';

export class UpdatePaymentMethodDto extends OmitType(
  CreatePaymentMethodDto,
  [],
) {}
