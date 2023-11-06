import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsHandler extends BaseHandler {
  constructor() {
    super(ProductsHandler.name);
  }

  @OnEvent('announcer.created')
  handleSpotCreated(payload: Product) {
    this.logger.log(`Spot ${payload.message} created.`);
  }
}
