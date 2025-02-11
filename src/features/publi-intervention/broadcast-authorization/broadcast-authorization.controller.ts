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
import { BroadcastAuthorizationService } from './broadcast-authorization.service';
import { CreateBroadcastAuthorizationDto } from './dto/create-broadcast-authorization.dto';
import { UpdateBroadcastAuthorizationDto } from './dto/update-broadcast-authorization.dto';
import { PaginationFilterBroadcastAuthorizationDto } from './dto/pagination-filter-broadcast-authorization.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../../auth/auth.decorator'; // Corrected import path

@Controller('broadcast-authorization')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('BroadcastAuthorization')
export class BroadcastAuthorizationController extends BaseController {
  constructor(
    private readonly broadcastAuthorizationService: BroadcastAuthorizationService,
  ) {
    super();
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  create(
    @Body()
    createBroadcastAuthorizationDto: CreateBroadcastAuthorizationDto,
  ) {
    return this.broadcastAuthorizationService.create(
      createBroadcastAuthorizationDto,
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  findAll(
    @Query() paginationFilter: PaginationFilterBroadcastAuthorizationDto,
  ) {
    return this.broadcastAuthorizationService.findAll(paginationFilter);
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.broadcastAuthorizationService.findOne(id);
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBroadcastAuthorizationDto: UpdateBroadcastAuthorizationDto,
  ) {
    return this.broadcastAuthorizationService.update(
      id,
      updateBroadcastAuthorizationDto,
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':bauthID')
  async deleteBroadAuth(
    @Param('bauthID') bauthID: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.broadcastAuthorizationService.deleteOne(bauthID);
    });
  }
}
