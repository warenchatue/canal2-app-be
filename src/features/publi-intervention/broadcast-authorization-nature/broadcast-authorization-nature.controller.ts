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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/shared/base-controller';
import { sendError } from 'src/common/helpers';
import { UseJwt } from '../../auth/auth.decorator'; // Corrected import path
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FindQueryDto } from 'src/common/dto/find-query.dto';
import { BroadcastAuthorizationNatureDocument } from './entities/broadcast-authorization-nature.entity';

// Corrected import path

@Controller('broadcast-authorization-nature')
//@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('BroadcastAuthorizationNature')
export class BroadcastAuthorizationNatureController extends BaseController {
  constructor(
    private readonly broadcastAuthorizationNatureService: BroadcastAuthorizationNatureService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async create(
    @Body() dto: CreateBroadcastAuthorizationNatureDto,
    @Req() { user },
  ) {
    try {
      return await this.run(async () => {
        const result = await this.broadcastAuthorizationNatureService.create(
          dto,
        );
        this.event.emit('broadcast-authorization-nature-created', result);
        return result;
      });
    } catch (error) {
      sendError(error);
    }
  }

  @Get()
  async findAll(
    @Req() { user },
    @Query() { states }: FindQueryDto<BroadcastAuthorizationNatureDocument>,
  ) {
    try {
      const data = await this.broadcastAuthorizationNatureService.findActive();
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
      return this.broadcastAuthorizationNatureService.findOne(id);
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
    dto: UpdateBroadcastAuthorizationNatureDto,
  ) {
    try {
      return await this.broadcastAuthorizationNatureService.update(id, dto);
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':bauthNID')
  async deleteBroadAuth(@Param('bauthNID') bauthNId: string, @Req() { user }) {
    return await this.run(async () => {
      return await this.broadcastAuthorizationNatureService.deleteOne(bauthNId);
    });
  }
}
