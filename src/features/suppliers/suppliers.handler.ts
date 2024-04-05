import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SuppliersHandler extends BaseHandler {
  constructor() {
    super(SuppliersHandler.name);
  }

  @OnEvent('supplier.created')
  handleSupplierCreated(payload: Supplier) {
    this.logger.log(`Supplier ${payload.phone} created.`);
  }
}
