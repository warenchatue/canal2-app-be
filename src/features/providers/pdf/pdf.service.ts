import { Injectable, Logger } from '@nestjs/common';
import { render } from 'ejs';
import * as fs from 'fs';
import wkhtmltopdf from 'wkhtmltopdf';
import { Readable } from 'stream';

@Injectable()
export class PdfService {
  private readonly logger: Logger = new Logger(PdfService.name);

  async generatePdf(content: string): Promise<Readable | null> {
    try {
      return wkhtmltopdf(content);
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async generateTemplate(
    template: 'wo' | 'o' | 'other',
    data: object,
  ): Promise<string> {
    if (template === 'wo') {
      const file = fs.readFileSync(
        __dirname + '/../../../templates/pdfs/wo.ejs',
        'utf-8',
      );
      return render(file, data);
    } else if (template === 'o') {
      const file = fs.readFileSync(
        __dirname + '/../../../templates/pdfs/o.ejs',
        'utf-8',
      );
      return render(file, data);
    } else if (template === 'other') {
      return '';
    }
  }
}
