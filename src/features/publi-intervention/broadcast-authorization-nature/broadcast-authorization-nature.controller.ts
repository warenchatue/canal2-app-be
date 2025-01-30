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
import { BroadcastAuthorizationNatureService } from './broadcast-authorization-nature.service';
import { CreateBroadcastAuthorizationNatureDto } from './dto/create-broadcast-authorization-nature.dto';
import { UpdateBroadcastAuthorizationNatureDto } from './dto/update-broadcast-authorization-nature.dto';
import { PaginationFilterBroadcastAuthorizationNatureDto } from './dto/pagination-filter-broadcast-authorization-nature.dto';

@Controller('broadcast-authorization-nature')
export class BroadcastAuthorizationNatureController {
  constructor(
    private readonly broadcastAuthorizationNatureService: BroadcastAuthorizationNatureService,
  ) {}

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.broadcastAuthorizationNatureService.findOne(id);
  }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.broadcastAuthorizationNatureService.remove(id);
  }
}
