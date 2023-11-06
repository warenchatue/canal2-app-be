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
import * as moment from 'moment';
import { sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../auth/auth.decorator';
import { OrdersService } from '../orders/orders.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { PlanningsService } from './plannings.service';
import { getNotPlayDto } from './dto/get-not-play';
import { autoValidatePlanningDto } from './dto/auto-validate.dto';

@Controller('plannings')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Plannings')
export class PlanningsController extends BaseController {
  private logger = new Logger(PlanningsController.name);

  constructor(
    private readonly planningsService: PlanningsService,
    private readonly ordersService: OrdersService,
  ) {
    super();
  }

  async updatePlanning(
    @Body() dto: UpdatePlanningDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.planningsService.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get('stats')
  async getPlanningStats() {
    return this.getPlannings(true);
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getPlannings(isStat = false) {
    return await this.run(async () => {
      const result = await this.planningsService.find();
      if (result.length == 0) {
        return {
          metaData: {
            totalItems: 0,
            totalDiffused: 0,
            totalNotDiffused: 0,
            totalPending: 0,
            totalToday: 0,
            resumeValues: [0, 0],
            statsValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            totalPackages: 0,
          },
          data: [],
        };
      }
      let data = result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        json['hour']['_id'] = json['hour']['_id'].toString();
        json['product']['_id'] = json['product']['_id'].toString();
        json['product']['order']['_id'] =
          json['product']['order']['_id'].toString();
        json['product']['order']['products'] = [];
        json['product']['order']['plannings'] = [];
        return json;
      });
      const dateArray = [];
      data = data.sort(function (a, b) {
        return a.date < b.date ? 1 : -1;
      });
      let actualDate = moment(data[0].date).format('DD/MM/yyyy');
      dateArray[actualDate] = [];
      let finalData = [];
      for (const d of data) {
        if (moment(d.date).format('DD/MM/yyyy') == actualDate) {
          dateArray[actualDate].push(d);
        } else {
          dateArray[actualDate] = dateArray[actualDate].sort(function (a, b) {
            return moment(a.date).format('HH:mm:ss') <
              moment(b.date).format('HH:mm:ss')
              ? -1
              : 1;
          });
          finalData = finalData.concat(dateArray[actualDate]);
          actualDate = moment(d.date).format('DD/MM/yyyy');
          dateArray[actualDate] = [];
          dateArray[actualDate].push(d);
        }
      }
      dateArray[actualDate] = dateArray[actualDate].sort(function (a, b) {
        return moment(a.date).format('HH:mm:ss') <
          moment(b.date).format('HH:mm:ss')
          ? -1
          : 1;
      });
      finalData = finalData.concat(dateArray[actualDate]);

      const totalItems = finalData.length;
      const totalDiffused = finalData.filter((e) => {
        return e.isManualPlay == true || e.isAutoPlay == true;
      }).length;
      const totalNotDiffused = finalData.filter((e) => {
        return (
          moment(e.date).isBefore(moment()) &&
          e.isManualPlay == false &&
          e.isAutoPlay == false
        );
      }).length;
      const totalPending = finalData.filter((e) => {
        return (
          moment(e.date).isAfter(moment()) &&
          e.isManualPlay == false &&
          e.isAutoPlay == false
        );
      }).length;
      const totalToday = finalData.filter((e) => {
        return (
          moment(e.date).format('DD/MM/yyyy') == moment().format('DD/MM/yyyy')
        );
      }).length;

      if (isStat == true) {
        const activeYear = '2023';
        const yearMonths = [];
        const yearValues = [];
        const resumeValues = [];
        const actualMonth = moment().format('MM/yyyy');
        const packages = await this.ordersService.find();
        for (let index = 1; index <= 12; index++) {
          yearMonths.push(
            index > 9
              ? index + '/' + activeYear
              : '0' + index + '/' + activeYear,
          );
        }
        for (const m of yearMonths) {
          const countItems = finalData.filter((e) => {
            return (
              moment(e.date).format('MM/yyyy') == m &&
              (e.isManualPlay == true || e.isAutoPlay == true)
            );
          }).length;
          if (actualMonth == m) {
            resumeValues.push(yearValues[yearValues.length - 1]);
            resumeValues.push(countItems);
          }
          yearValues.push(countItems);
        }
        return {
          metaData: {
            totalItems,
            totalDiffused,
            totalNotDiffused,
            totalPending,
            totalToday,
            resumeValues,
            statsValues: yearValues,
            totalPackages: packages.length,
          },
          data: finalData,
        };
      }

      return {
        metaData: {
          totalItems,
          totalDiffused,
          totalNotDiffused,
          totalPending,
          totalToday,
        },
        data: finalData,
      };
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':planningId')
  async getPlanning(@Param('planningId') planningId: string) {
    return await this.run(async () => {
      const result = await this.planningsService.findOne(planningId);
      const json = result.toJSON();
      json['_id'] = json['_id'].toString();
      json['_id'] = json['_id'].toString();
      json['hour']['_id'] = json['hour']['_id'].toString();
      json['product']['_id'] = json['product']['_id'].toString();
      json['product']['order']['_id'] =
        json['product']['order']['_id'].toString();
      json['product']['order']['products'] = [];
      json['product']['order']['plannings'] = [];
      return json;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post('notDiffused/code')
  async getNotPlay(
    @Body() dto: getNotPlayDto,
    // @Req() { user },
  ) {
    return await this.run(async () => {
      let plannings = await this.planningsService.find();
      plannings = plannings.map((e) => {
        const json = e.toJSON();
        return json;
      });
      plannings = plannings.filter(
        (p) =>
          moment(p.date).format('DD/MM/yyyy') >=
            moment(dto.beginDate).format('DD/MM/yyyy') &&
          moment(p.date).format('DD/MM/yyyy') <=
            moment(dto.endDate).format('DD/MM/yyyy') &&
          p.isAutoPlay == false,
      );

      const data = plannings.map((e) => {
        return e.code;
      });

      return data;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post('autoValidate/codes')
  async autoValidate(
    @Body() dto: autoValidatePlanningDto,
    // @Req() { user },
  ) {
    return await this.run(async () => {
      for (const code of dto.codes) {
        await this.planningsService.updateDiffusedByCode(code);
      }
      return true;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post(':packageId')
  async createPlanning(
    @Param('packageId') packageId: string,
    @Body() dto: CreatePlanningDto,
    // @Req() { user },
  ) {
    try {
      const planning = await await this.planningsService.create(dto);
      await this.ordersService.addPlanning(packageId, planning._id.toString());
      return await this.getPlanning(planning._id.toString());
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':planningId')
  async updateAccount(
    @Param('planningId') accountId: string,
    @Body() dto: UpdatePlanningDto,
    // @Req() { user },
  ) {
    try {
      const planning = await (
        await this.planningsService.update(accountId, dto)
      ).toJSON();
      return planning;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':planningId')
  async deletePlanning(
    @Param('planningId') planningId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      const planning = (
        await this.planningsService.findOne(planningId)
      ).toJSON();
      const response = await this.planningsService.deleteOne(planningId);
      await this.ordersService.pullPlanning(
        planning['product']['order']['_id'].toString(),
        planningId,
      );
      return response;
    });
  }
}
