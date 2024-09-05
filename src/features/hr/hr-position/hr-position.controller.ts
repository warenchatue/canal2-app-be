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
import { UpdateHrPositionDto } from './dto/update-hr-position.dto';
import { HrPositionService } from './hr-position.service';
import { CreateHrPositionDto } from './dto/create-hr-position.dto';

@Controller('hr-positions')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('HrPositions')
export class HrPositionController extends BaseController {
  private logger = new Logger(HrPositionController.name);

  constructor(private readonly hrPositionService: HrPositionService) {
    super();
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.hrPositionService.find();
      return result.map((e) => {
        // const json = e.toJSON();
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
  @Get(':hrPositionId')
  async getHrPosition(@Param('hrPositionId') hrPositionId: string) {
    return await this.run(async () => {
      const result = (
        await this.hrPositionService.findOne(hrPositionId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createHrPosition(@Body() dto: CreateHrPositionDto) {
    try {
      return (await this.hrPositionService.create(dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  async updateHrPosition(
    @Body() dto: UpdateHrPositionDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.hrPositionService.update(user._id, dto),
    );
  }

  // @ApiBearerAuth()
  // @UseJwt()
  // @Put(':hrPositionId')
  // async updateAccount(
  //   @Param('hrPositionId') hrPositionId: string,
  //   @Body() dto: UpdateHrPositionDto,
  // ) {
  //   try {
  //     return (await this.hrPositionService.update(hrPositionId, dto)).toJSON();
  //   } catch (error) {
  //     sendError(error);
  //   }
  // }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':hrPositionId')
  async deleteTax(
    @Param('hrPositionId') hrPositionId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.hrPositionService.deleteOne(hrPositionId);
    });
  }
}
