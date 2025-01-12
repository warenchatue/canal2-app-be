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
import { UpdateHrAddressDto } from './dto/update-hr-address.dto';
import { HrAddressService } from './hr-address.service';
import { CreateHrAddressDto } from './dto/create-hr-address.dto';

@Controller('hr-addresses')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('HrAddresses')
export class HrAddressController extends BaseController {
  private logger = new Logger(HrAddressController.name);

  constructor(private readonly hrAddressService: HrAddressService) {
    super();
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.hrAddressService.find();
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
  @Get(':hrAddressId')
  async getHrAddress(@Param('hrAddressId') hrAddressId: string) {
    return await this.run(async () => {
      const result = (
        await this.hrAddressService.findOne(hrAddressId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createHrAddress(@Body() dto: CreateHrAddressDto) {
    try {
      return (await this.hrAddressService.create(dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':hrAddressId')
  async updateHrAddress(
    @Body() dto: UpdateHrAddressDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.hrAddressService.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':hrAddressId')
  async deleteTax(
    @Param('hrAddressId') hrAddressId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.hrAddressService.deleteOne(hrAddressId);
    });
  }
}
