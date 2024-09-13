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
import { HrPersonnelService } from '../../hr/hr-personnel/hr-personnel.service';
import { CreateHrPersonnelDto } from '../../hr/hr-personnel/dto/create-hr-personnel.dto';
import { UpdateHrPersonnelDto } from '../../hr/hr-personnel/dto/update-hr-personnel.dto';

// import { FirebaseService } from '../firebase/firebase.service';

@Controller('hr-personnels')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('hrPersonnels')
export class HrPersonnelController extends BaseController {
  private logger = new Logger(HrPersonnelController.name);

  constructor(private readonly hrPersonnelServices: HrPersonnelService) {
    super();
  }

  async UpdateHrPersonnel(
    @Body() dto: UpdateHrPersonnelDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.hrPersonnelServices.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.hrPersonnelServices.find();
      return result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        if (json['parent']) {
          json['parent']['_id'] = json['parent']['_id'].toString();
        }

        return json;
      });
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':hrPersonnelId')
  async getAccount(@Param('hrPersonnelId') hrPersonnelId: string) {
    return await this.run(async () => {
      const result = (
        await this.hrPersonnelServices.findOne(hrPersonnelId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createHrPersonnel(@Body() dto: CreateHrPersonnelDto) {
    try {
      return (await this.hrPersonnelServices.create(dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':hrPersonnelId')
  async updateAccount(
    @Param('hrPersonnelId') accountId: string,
    @Body() dto: UpdateHrPersonnelDto,
  ) {
    try {
      return (await this.hrPersonnelServices.update(accountId, dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':hrPersonnelId')
  async deleteHrPersonnel(@Param('hrPersonnelId') hrPersonnelId: string) {
    return await this.run(async () => {
      return await this.hrPersonnelServices.deleteOne(hrPersonnelId);
    });
  }
}
