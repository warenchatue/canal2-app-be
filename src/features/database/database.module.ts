import { Module } from '@nestjs/common';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { DatabaseHandler } from './database.handler';
import { DatabaseCron } from './database.cron';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [DatabaseController],
  providers: [DatabaseService, DatabaseHandler, DatabaseCron],
  exports: [DatabaseService],
})
export class DatabaseModule {}
