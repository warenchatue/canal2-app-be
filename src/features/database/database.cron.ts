import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from './database.service';

@Injectable()
export class DatabaseCron {
  private readonly logger: Logger = new Logger(DatabaseCron.name);

  constructor(private readonly databaseService: DatabaseService) {}

  @Cron('*/5 * * * *') // Every 1 minute
  async exportDB() {
    this.logger.warn('🚀 Start exporting database...');
    await this.databaseService.exportCollections(
      'test',
      [],
      '/home/db-backups/dinoes',
    );
    this.logger.warn('✅ Database exported.');
  }
}
