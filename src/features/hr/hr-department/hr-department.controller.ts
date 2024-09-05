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
import { UpdateHrDepartmentDto } from './dto/update-hr-department.dto';
import { CreateHrDepartmentDto } from './dto/create-hr-department.dto';
import { HrDepartmentService } from './hr-department.service';

@Controller('hr-departments')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('HrDepartments')
export class HrDepartmentController extends BaseController {
  private logger = new Logger(HrDepartmentController.name);

  constructor(private readonly departmentService: HrDepartmentService) {
    super();
  }

  async UpdateDepartment(
    @Body() dto: UpdateHrDepartmentDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.departmentService.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.departmentService.find();
      return result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        return json;
      });
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':hrDepartmentId')
  async getAccount(@Param('hrDepartmentId') hrDepartmentId: string) {
    return await this.run(async () => {
      const result = (
        await this.departmentService.findOne(hrDepartmentId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createDepartment(@Body() dto: CreateHrDepartmentDto) {
    try {
      return (await this.departmentService.create(dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':hrDepartmentId')
  async updateAccount(
    @Param('hrDepartmentId') accountId: string,
    @Body() dto: UpdateHrDepartmentDto,
  ) {
    try {
      return (await this.departmentService.update(accountId, dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':hrDepartmentId')
  async deleteDepartment(@Param('hrDepartmentId') hrDepartmentId: string) {
    return await this.run(async () => {
      return await this.departmentService.deleteOne(hrDepartmentId);
    });
  }
}
