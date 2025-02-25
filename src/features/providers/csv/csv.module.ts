import { Module } from '@nestjs/common';
import { CsvExportService } from './csv.service';

@Module({
  providers: [CsvExportService],
  exports: [CsvExportService],
})
export class CsvExportModule {}
