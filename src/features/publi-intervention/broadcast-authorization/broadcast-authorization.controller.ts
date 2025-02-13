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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../../auth/auth.decorator'; // Corrected import path
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FindQueryDto } from 'src/common/dto/find-query.dto';
import { BroadcastAuthorizationDocument } from './entities/broadcast-authorization.entity';
import { sendError } from 'src/common/helpers';

// Corrected import path

@Controller('broadcast-authorization')
//@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('BroadcastAuthorization')
export class BroadcastAuthorizationController extends BaseController {
  constructor(
    private readonly broadcastAuthorizationService: BroadcastAuthorizationService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async create(@Body() dto: CreateBroadcastAuthorizationDto, @Req() { user }) {
    try {
      return await this.run(async () => {
        const result = await this.broadcastAuthorizationService.create(dto);
        this.event.emit('broadcast-authorization-created', result);
        return result;
      });
    } catch (error) {
      sendError(error);
    }
  }

  @Get()
  async findAll(
    @Req() { user },
    @Query() { states }: FindQueryDto<BroadcastAuthorizationDocument>,
  ) {
    try {
      const data = await this.broadcastAuthorizationService.findActive();
      const totalitesm = data.length;
      const final_result = data.map((e) => {
        const json = e.toJSON();
        return json;
      });

      return {
        metaData: {
          totalitesm,
        },
        data: final_result,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() { user }) {
    try {
      return this.broadcastAuthorizationService.findOne(id);
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    dto: UpdateBroadcastAuthorizationDto,
  ) {
    try {
      return await this.broadcastAuthorizationService.update(id, dto);
    } catch (error) {
      sendError(error);
    }
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
