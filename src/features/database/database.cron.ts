import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from './database.service';
import { DB_BACKUP_PATH, DB_NAME } from 'src/common/vars';

@Injectable()
export class DatabaseCron {
  private readonly logger: Logger = new Logger(DatabaseCron.name);

  constructor(private readonly databaseService: DatabaseService) {}

  @Cron('*/5 * * * *') // Every 5 minutes
  async exportDB0() {
    this.logger.warn('🚀 Start exporting database...');
    await this.databaseService.exportCollections(DB_NAME, [], DB_BACKUP_PATH);
    this.logger.warn('✅ Database exported.');
  }

  @Cron('0 13 * * *') // Every day at 1 PM
  async exportDB1() {
    this.logger.warn('🚀 1- Start exporting database...');
    await this.databaseService.exportCollections(DB_NAME, [], DB_BACKUP_PATH);
    this.logger.warn('✅ Database exported.');
  }

  @Cron('0 23 * * *') // Every day at 11 PM
  async exportDB2() {
    this.logger.warn('🚀 2- Start exporting database...');
    await this.databaseService.exportCollections(DB_NAME, [], DB_BACKUP_PATH);
    this.logger.warn('✅ Database exported.');
  }
}
