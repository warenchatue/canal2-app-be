import {
  Controller,
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

@Controller('broadcast-authorization')
export class BroadcastAuthorizationController {
  constructor(
    private readonly broadcastAuthorizationService: BroadcastAuthorizationService,
  ) {}

  @Post()
  create(
    @Body()
    createBroadcastAuthorizationDto: CreateBroadcastAuthorizationDto,
  ) {
    return this.broadcastAuthorizationService.create(
      createBroadcastAuthorizationDto,
    );
  }

  @Get()
  findAll(
    @Query() paginationFilter: PaginationFilterBroadcastAuthorizationDto,
  ) {
    return this.broadcastAuthorizationService.findAll(paginationFilter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.broadcastAuthorizationService.findOne(id);
  }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.broadcastAuthorizationService.remove(id);
  }
}
