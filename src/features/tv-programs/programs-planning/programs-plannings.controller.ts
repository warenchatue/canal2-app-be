import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as moment from 'moment';
import { makeId, sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../../auth/auth.decorator';
import { CreateProgramPlanningDto } from './dto/create-program-planning.dto';
import { UpdatePlanningDto } from './dto/update-program-planning.dto';
import { ProgramPlanningsService } from './programs-plannings.service';
import { getNotPlayDto } from './dto/get-not-play';
import { autoValidatePlanningDto } from './dto/auto-validate.dto';
import { manualValidatePlanningDto } from './dto/manual-validate.dto';
import { PackagesService } from 'src/features/pub/packages/packages.service';
import { forIn } from 'lodash';
import { Planning } from '../../pub/plannings/entities/planning.entity';

@Controller('programs-plannings')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('ProgramsPlannings')
export class PlanningsController extends BaseController {
  constructor(
    private readonly programPlanningsService: ProgramPlanningsService,
    private readonly packagesService: PackagesService,
  ) {
    super();
  }

  async updatePlanning(
    @Body() dto: UpdatePlanningDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.programPlanningsService.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get('stats')
  async getPlanningStats() {
    return this.getPlannings(true, false);
  }
  @ApiBearerAuth()
  @UseJwt()
  @Get('today')
  async getPlanningToday() {
    return this.getPlannings(false, true);
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getPlannings(isStat = false, isToday = false) {
    return await this.run(async () => {
      let result = await this.programPlanningsService.find();
      if (isToday) {
        result = result.filter((e) => {
          return (
            moment(e.date).format('DD/MM/yyyy') == moment().format('DD/MM/yyyy')
          );
        });
      }
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
          },
          data: [],
        };
      }
      let data = result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        if (json['hour']) {
          json['hour']['_id'] = json['hour']['_id'].toString();
        }
        if (json['tvProgram']) {
          json['tvProgram']['_id'] = json['tvProgram']['_id'].toString();
        }

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
        const activeYear = '2024';
        const yearMonths = [];
        const yearValues = [];
        const resumeValues = [];
        const actualMonth = moment().format('MM/yyyy');
        const packages = await this.packagesService.find();
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
      const result = await this.programPlanningsService.findOne(planningId);
      const json = result.toJSON();
      json['_id'] = json['_id'].toString();
      if (json['hour']) {
        json['hour']['_id'] = json['hour']['_id'].toString();
      }
      if (json['tvProgram']) {
        json['tvProgram']['_id'] = json['tvProgram']['_id'].toString();
      }
      if (json['tvProgramHost']) {
        json['tvProgramHost']['_id'] = json['tvProgramHost']['_id'].toString();
      }
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
      let plannings = await this.programPlanningsService.find();
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
        await this.programPlanningsService.updateDiffusedByCode(code);
      }
      return true;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post('manual-validate/ids')
  async manualValidateIds(
    @Body() dto: manualValidatePlanningDto,
    @Req() { user },
  ) {
    return await this.run(async () => {
      for (const _id of dto._ids) {
        await this.programPlanningsService.updateDiffusedById(_id, user._id);
      }
      const myCampaign = await this.packagesService.findOne(dto.packageId);
      return myCampaign.toJSON();
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete('bulk-deletion/ids')
  async bulkDeletion(@Body() dto: manualValidatePlanningDto) {
    return await this.run(async () => {
      for (const _id of dto._ids) {
        await this.programPlanningsService.deleteOne(_id);
      }
      return true;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post('')
  async createPlanning(
    @Body() dto: CreateProgramPlanningDto,
    // @Req() { user },
  ) {
    try {
      const planning = await await this.programPlanningsService.create(dto);
      return await this.getPlanning(planning._id.toString());
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post('/bulk')
  async createPlannings(
    @Body() dtos: CreateProgramPlanningDto[],
    // @Req() { user },
  ) {
    try {
      const myPlannings = [];
      for (let index = 0; index < dtos.length; index++) {
        const planning = await this.programPlanningsService.create({
          ...dtos[index],
          code: makeId(4),
        });
        const endPlanning = await this.getPlanning(planning._id.toString());
        myPlannings.push(endPlanning);
      }

      return myPlannings;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post('/default-bulk')
  async updateDefaultPlannings(
    @Body() ids: string[],
    // @Req() { user },
  ) {
    try {
      await this.programPlanningsService.setDefaultForIds(ids);
      return await this.programPlanningsService.findByIds(ids);
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post('/use-default-bulk')
  async useeDefaultPlannings() {
    try {
      const allDefaults = await this.programPlanningsService.findDefaults();
      const plannings = [];
      for (const i in allDefaults) {
        const newPlanning = allDefaults[i];
        const newDate = new Date(newPlanning.date);
        newDate.setDate(newDate.getDate() + 7);
        const p = await this.programPlanningsService.createOne({
          ...newPlanning,
          isDefault: false,
          position: newDate.toISOString(),
          date: newDate.toISOString(),
          hour: newPlanning.hour.toString(),
          tvProgram: newPlanning.tvProgram.toString(),
          tvProgramHost: newPlanning.tvProgramHost?.toString() ?? undefined,
          description: newPlanning.description,
        });
        plannings.push(p);
      }
      return plannings;
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
        await this.programPlanningsService.update(accountId, dto)
      ).toJSON();
      return planning;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':planningId')
  async deletePlanning(@Param('planningId') planningId: string) {
    return await this.run(async () => {
      const response = await this.programPlanningsService.deleteOne(planningId);
      return response;
    });
  }
}
