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
import * as _ from 'lodash';
import { sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../auth/auth.decorator';
import { RolesService } from './roles.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('roles')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Roles')
export class RolesController extends BaseController {
  private logger = new Logger(RolesController.name);

  constructor(private readonly rolesService: RolesService) {
    super();
  }

  async updateRole(@Body() dto: UpdateRoleDto, @Req() { user }: URequest) {
    return await this.run(
      async () => await this.rolesService.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAllRoles() {
    return await this.run(async () => {
      const result = await this.rolesService.find();
      const final_result = result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        return json;
      });

      return final_result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':roleId')
  async getRole(@Param('roleId') roleId: string) {
    return await this.run(async () => {
      const result = (await this.rolesService.findOne(roleId)).toJSON();
      console.log(result);
      return _.omit(result, ['password', 'notifications']);
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createRole(
    @Body() dto: CreateRoleDto,
    // @Req() { user },
  ) {
    try {
      const role = await (await this.rolesService.create(dto)).toJSON();
      return role;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':roleId')
  async update(
    @Param('roleId') accountId: string,
    @Body() dto: UpdateRoleDto,
    // @Req() { user },
  ) {
    try {
      const role = await (
        await this.rolesService.update(accountId, dto)
      ).toJSON();
      return {
        firstName: role.name,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':roleId')
  async deleteRole(@Param('roleId') roleId: string, @Req() { user }: URequest) {
    return await this.run(async () => {
      return await this.rolesService.deleteOne(roleId);
    });
  }
}
