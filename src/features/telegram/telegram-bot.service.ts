// telegram-bot.service.ts
import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramBotService {
  private bot: TelegramBot;

  constructor() {
    this.bot = new TelegramBot(
      '7042453481:AAECOLo9O3HvSNzylqnY-gFWh7CVQUYxrnM',
      { polling: true },
    );
  }

  sendMessage(chatId: string, text: string): void {
    this.bot.sendMessage(chatId, text);
  }

  sendDocument(chatId: string, zipFilePath: string): void {
    this.bot
      .sendDocument(chatId, zipFilePath)
      .then(() => console.log('File sent successfully'))
      .catch((error) => console.error('Error sending file:', error));
  }
}
