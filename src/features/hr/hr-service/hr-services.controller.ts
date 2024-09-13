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
import { sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../../auth/auth.decorator';
import { UpdateHrServiceDto } from './dto/update-hr-service.dto';
import { CreateHrServiceDto } from './dto/create-hr-service.dto';
import { HrServiceService } from './hr-services.service';

@Controller('hr-services')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('HrServices')
export class HrServiceController extends BaseController {
  private logger = new Logger(HrServiceController.name);

  constructor(private readonly hrServiceService: HrServiceService) {
    super();
  }

  async updateHrService(
    @Body() dto: UpdateHrServiceDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.hrServiceService.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.hrServiceService.find();
      return result.map((e) => {
        // Deep clone the object to ensure mutability
        const json = JSON.parse(JSON.stringify(e.toJSON()));

        // Convert _id to string if it exists
        if (json['_id']) {
          json['_id'] = json['_id'].toString();
        }

        // If department exists, ensure its _id is converted to string
        if (json['department'] && json['department']['_id']) {
          json['department']['_id'] = json['department']['_id'].toString();
        }
        return json;
      });
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':hrServiceId')
  async getAccount(@Param('hrServiceId') hrServiceId: string) {
    return await this.run(async () => {
      const result = (
        await this.hrServiceService.findOne(hrServiceId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createTax(@Body() dto: CreateHrServiceDto) {
    try {
      return (await this.hrServiceService.create(dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':hrServiceId')
  async updateAccount(
    @Param('hrServiceId') hrServiceId: string,
    @Body() dto: UpdateHrServiceDto,
  ) {
    try {
      return (await this.hrServiceService.update(hrServiceId, dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':hrServiceId')
  async deleteTax(
    @Param('hrServiceId') hrServiceId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.hrServiceService.deleteOne(hrServiceId);
    });
  }
}
