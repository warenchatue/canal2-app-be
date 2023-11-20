import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';
import { FindQueryDto } from 'src/common/dto/find-query.dto';
import { sendError } from 'src/common/helpers';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../auth/auth.decorator';
import { CreateOrgDto } from './dto/create-org.dto';
import { Org } from './entities/org.entity';
// eslint-disable-next-line prettier/prettier
import {
  GROUP_CREATED_EVENT,
} from './orgs.handler';
import { OrgsService } from './orgs.service';
import { BaseController } from 'src/common/shared/base-controller';
import { UpdateOrgDto } from './dto/update-org.dto';

@ApiTags('Orgs')
@Controller('orgs')
export class OrgsController extends BaseController {
  constructor(
    protected readonly orgsService: OrgsService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async create(@Body() dto: CreateOrgDto, @Req() { user }: URequest) {
    return this.run(async () => {
      const group = await this.orgsService.create(dto, user._id);
      this.event.emit(GROUP_CREATED_EVENT, group.toJSON());
      return group;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async findAll(@Req() { user }: URequest, @Query() query: FindQueryDto<Org>) {
    return this.run(async () => {
      const userId = user._id;
      const result = await this.orgsService.findByUser(userId, query);
      return result;
    });
  }

  @Get('/slug/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    return this.run(async () => {
      const org = await this.orgsService.findBySlug(slug, true);
      return org;
    });
  }

  @Get(':orgId')
  async findOneById(@Param('orgId') orgId: string) {
    return this.run(async () => {
      const group = await this.orgsService.findOne(orgId, true);
      return group;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get('/full/:orgId')
  async findOneFullById(@Param('orgId') orgId: string) {
    return this.run(async () => {
      const group = await this.orgsService.findOne(orgId, true);
      return { ...group.toJSON() };
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':orgId')
  async deleteGroup(@Param('orgId') orgId: string, @Req() { user }: URequest) {
    return await this.run(async () => {
      return await this.orgsService.deleteOne(orgId);
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':orgId')
  async updateGroup(
    @Param('orgId') orgId: string,
    @Body() dto: UpdateOrgDto,
    @Req() { user },
  ) {
    try {
      return await this.orgsService.updateOrg(orgId, dto);
    } catch (error) {
      sendError(error);
    }
  }
}
