import { Controller, Post, Body } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UseJwt } from '../auth/auth.decorator';

@ApiBearerAuth()
@ApiTags('Database')
@UseJwt()
@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post()
  async export(
    @Body()
    body: {
      database: string;
      collections: string[];
      outputPath: string;
    },
  ) {
    await this.databaseService.exportCollections(
      body.database,
      body.collections,
      body.outputPath,
    );
    return { message: 'Collections exported successfully' };
  }
}
