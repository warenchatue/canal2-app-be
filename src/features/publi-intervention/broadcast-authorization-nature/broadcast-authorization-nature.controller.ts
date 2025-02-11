import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Req,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BroadcastAuthorizationNatureService } from './broadcast-authorization-nature.service';
import { CreateBroadcastAuthorizationNatureDto } from './dto/create-broadcast-authorization-nature.dto';
import { UpdateBroadcastAuthorizationNatureDto } from './dto/update-broadcast-authorization-nature.dto';
import { PaginationFilterBroadcastAuthorizationNatureDto } from './dto/pagination-filter-broadcast-authorization-nature.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../../auth/auth.decorator'; // Corrected import path

@Controller('broadcast-authorization-nature')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('BroadcastAuthorizationNature')
export class BroadcastAuthorizationNatureController extends BaseController {
  constructor(
    private readonly broadcastAuthorizationNatureService: BroadcastAuthorizationNatureService,
  ) {
    super();
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  create(
    @Body()
    createBroadcastAuthorizationNatureDto: CreateBroadcastAuthorizationNatureDto,
  ) {
    return this.broadcastAuthorizationNatureService.create(
      createBroadcastAuthorizationNatureDto,
    );
  }

  @Get()
  findAll(
    @Query() paginationFilter: PaginationFilterBroadcastAuthorizationNatureDto,
  ) {
    return this.broadcastAuthorizationNatureService.findAll(paginationFilter);
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.broadcastAuthorizationNatureService.findOne(id);
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateBroadcastAuthorizationNatureDto: UpdateBroadcastAuthorizationNatureDto,
  ) {
    return this.broadcastAuthorizationNatureService.update(
      id,
      updateBroadcastAuthorizationNatureDto,
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':bauthNID')
  async deleteBroadAuth(
    @Param('bauthNID') bauthNId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.broadcastAuthorizationNatureService.deleteOne(bauthNId);
    });
  }
}
