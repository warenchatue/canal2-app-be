import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesHandler extends BaseHandler {
  constructor() {
    super(CountriesHandler.name);
  }

  @OnEvent('role.created')
  handleRoleCreated(payload: Country) {
    this.logger.log(`Country ${payload.name} created.`);
  }
}
