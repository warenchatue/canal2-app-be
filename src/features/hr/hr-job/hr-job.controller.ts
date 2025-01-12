import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/shared/base-controller';
import { HrJobService } from './hr-job.service';
import { UseJwt } from '../../auth/auth.decorator';
import { UpdateHrJobDto } from './dto/update-hr-job.dto';
import { CreateHrJobDto } from './dto/create-hr-job.dto';

@Controller('hr-jobs')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('HrJobs')
export class HrJobController extends BaseController {
  private logger = new Logger(HrJobController.name);

  constructor(private readonly hrJobServices: HrJobService) {
    super();
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.hrJobServices.findAll();
      return result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();

        if (json['position']) {
          json['position']['_id'] = json['position']['_id'].toString();
        }

        if (json['department']) {
          json['department']['_id'] = json['department']['_id'].toString();
        }
        return json;
      });
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':hrJobId')
  async getJob(@Param('hrJobId') hrJobId: string) {
    return await this.run(async () => {
      const job = await this.hrJobServices.findOne(hrJobId);
      return job.toJSON();
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createHrJob(@Body() dto: CreateHrJobDto) {
    return await this.run(async () => {
      const newJob = await this.hrJobServices.create(dto);
      return newJob.toJSON();
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':hrJobId')
  async updateHrJob(
    @Param('hrJobId') hrJobId: string,
    @Body() dto: UpdateHrJobDto,
  ) {
    return await this.run(async () => {
      const updatedJob = await this.hrJobServices.update(hrJobId, dto);
      return updatedJob.toJSON();
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':hrJobId')
  async deleteHrJob(@Param('hrJobId') hrJobId: string) {
    return await this.run(async () => {
      await this.hrJobServices.deleteOne(hrJobId);
      return { message: 'Job deleted successfully' };
    });
  }
}
