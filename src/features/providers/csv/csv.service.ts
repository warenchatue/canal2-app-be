import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';

@Injectable()
export class CsvExportService {
  exportToCsv(data: any[], fields: string[]): string {
    try {
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(data);
      return csv;
    } catch (err) {
      throw new Error(`Failed to convert data to CSV: ${err.message}`);
    }
  }
}
