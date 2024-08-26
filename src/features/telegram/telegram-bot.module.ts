import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramBotService } from './telegram-bot.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [TelegramBotService],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}
