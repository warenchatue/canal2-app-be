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
import { FindQueryDto } from 'src/common/dto/find-query.dto';
import { sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { UseJwt } from '../../auth/auth.decorator';
import { CreateTvProgramDto } from './dto/create-program.dto';
import { UpdateTvProgramDto } from './dto/update-program.dto';
import { TvProgramDocument } from './entities/program.entity';
import { TvProgramsService } from './programs.service';
import { PlanningsService } from '../../pub/plannings/plannings.service';
import { ProductService } from '../../products/products.service';
import { ORDER_CREATED_EVENT } from './programs.handler';

@ApiBearerAuth()
@ApiTags('TvPrograms')
@UseJwt()
@Controller('tv-programs')
export class TvProgramController extends BaseController {
  constructor(
    private readonly tvProgramsService: TvProgramsService,
    private readonly planningsService: PlanningsService,
    private readonly productService: ProductService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @Post()
  async create(@Body() dto: CreateTvProgramDto, @Req() { user }) {
    try {
      return await this.run(async () => {
        const result = await this.tvProgramsService.create({
          ...dto,
          creator: user._id,
        });

        this.event.emit(ORDER_CREATED_EVENT, {
          code: dto.code,
          accountId: user._id,
          completed: true,
        });

        return result;
      });
    } catch (error) {
      sendError(error);
    }
  }

  @Get()
  async getAllTvPrograms(
    @Req() { user },
    @Query() { states }: FindQueryDto<TvProgramDocument>,
  ) {
    try {
      const data = await this.tvProgramsService.find();
      const totalItems = data.length;
      const final_result = data.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        if (json['host']) {
          json['host']['_id'] = json['host']['_id'].toString();
        }
        return json;
      });

      return {
        metaData: {
          totalItems,
        },
        data: final_result,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @Get(':tvProgramId')
  async getTvProgram(
    @Param('tvProgramId') tvProgramId: string,
    @Req() { user },
  ) {
    try {
      return await this.tvProgramsService.findOne(tvProgramId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':tvProgramId')
  async updateTvProgram(
    @Param('tvProgramId') tvProgramId: string,
    @Body() dto: UpdateTvProgramDto,
    @Req() { user },
  ) {
    try {
      return await this.tvProgramsService.updateOne(tvProgramId, dto);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':tvProgramId/close')
  async closeTvProgram(
    @Param('tvProgramId') tvProgramId: string,
    @Req() { user },
  ) {
    try {
      return await this.tvProgramsService.closeTvProgram(tvProgramId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':tvProgramId/reopen')
  async reopenTvProgram(
    @Param('tvProgramId') tvProgramId: string,
    @Req() { user },
  ) {
    try {
      return await this.tvProgramsService.reopenTvProgram(tvProgramId);
    } catch (error) {
      sendError(error);
    }
  }

  @Delete(':tvProgramId')
  async deleteTvProgram(
    @Param('tvProgramId') tvProgramId: string,
    @Req() { user },
  ) {
    try {
      const orderTvProgram = await this.tvProgramsService.findOne(tvProgramId);
      return await this.tvProgramsService.deleteOne(tvProgramId);
    } catch (error) {
      sendError(error);
    }
  }
}
