import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseHandler } from 'src/common/shared/base-handler';
import { HrJob } from './entities/hr-job.entity';

@Injectable()
export class HrJobHandler extends BaseHandler {
  constructor() {
    super(HrJobHandler.name);
  }

  @OnEvent('assetBrand.created')
  handleAssetBrandCreated(payload: HrJob) {
    this.logger.log(`hrJob ${payload.title} created.`);
  }
}
