import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as moment from 'moment';
import * as JSZip from 'jszip';
import * as path from 'path';
import { execSync } from 'child_process';
import { TelegramBotService } from '../telegram/telegram-bot.service';

@Injectable()
export class DatabaseService {
  constructor(private readonly telegramBotService: TelegramBotService) {}
  async exportCollections(
    database: string,
    collections: string[],
    outputPath: string,
  ): Promise<void> {
    // Export collections using mongodump
    const dumpPath = `${outputPath}/dump`;
    const dbPath = `${dumpPath}/${database}`;
    const zipPath = `${outputPath}/dinoes-db-${moment().format(
      'yyyy-MM-DD-hh-mm',
    )}.zip`;
    execSync(
      `mongodump --host 194.163.148.164 --port 2720 --db ${database} --out ${dumpPath}`,
      { stdio: 'inherit' },
    );

    await this.compressFilesToZip(dbPath, zipPath);
    // Clean up the dump directory
    fs.rmdirSync(dumpPath, { recursive: true });

    //Send to the telegram bot
    // const fileContent = fs.readFileSync(zipPath);
    this.telegramBotService.sendDocument('746455861', zipPath);
  }

  async compressFilesToZip(
    directoryPath: string,
    zipFilePath: string,
  ): Promise<void> {
    const zip = new JSZip();
    const files = await this.getFilesFromDirectory(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileContent = fs.readFileSync(filePath);
      zip.file(file, fileContent);
    }

    await zip.generateAsync({ type: 'nodebuffer' }).then((content) => {
      fs.writeFileSync(zipFilePath, content);
    });
  }
  async getFilesFromDirectory(directoryPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }
}
