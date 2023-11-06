import { Logger } from '@nestjs/common';

export class BaseHandler {
  protected readonly logger: Logger;

  constructor(logName: string) {
    this.logger = new Logger(logName);
  }
}
