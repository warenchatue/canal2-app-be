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
import { sendError, syncDateWithHourCode } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { UseJwt } from '../../auth/auth.decorator';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { CampaignDocument } from './entities/package.entity';
import { PackagesService } from './packages.service';
import { PlanningsService } from '../../pub/plannings/plannings.service';
import { ProductService } from '../../products/products.service';
import { ORDER_CREATED_EVENT } from './packages.handler';

@ApiBearerAuth()
@ApiTags('Packages')
@UseJwt()
@Controller('packages')
export class PackageController extends BaseController {
  constructor(
    private readonly packagesService: PackagesService,
    private readonly planningsService: PlanningsService,
    private readonly productService: ProductService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @Post()
  async create(@Body() dto: CreatePackageDto, @Req() { user }) {
    try {
      return await this.run(async () => {
        const result = await this.packagesService.create({
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
  async getAllPackages() {
    try {
      const data = await this.packagesService.find();
      const totalItems = data.length;
      const totalAnnouncers = 0;
      let totalSpots = 0;
      const allSpots = data.map((e: any) => {
        return e.plannings.length;
      });
      if (allSpots.length > 0) {
        totalSpots = allSpots.reduce(function (a: any, b: any) {
          return a + b;
        });
      }
      let totalFiles = 0;
      const allFiles = data.map((e) => {
        return e.products.length;
      });

      if (allFiles.length > 0) {
        totalFiles = allFiles.reduce(function (a: any, b: any) {
          return a + b;
        });
      }

      return {
        metaData: {
          totalItems,
          totalAnnouncers: totalAnnouncers,
          totalSpots,
          totalFiles,
        },
        data,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @Get('/paginate')
  async getAllCampaignsPaginate(
    @Query() query: FindQueryDto<CampaignDocument>,
  ) {
    try {
      const data = await this.packagesService.findPaginate(query);
      const totalItems = data.metadata.total;
      const totalAnnouncers = 0;
      let totalSpots = 0;
      const allSpots = data.data.map((e: any) => {
        return e.plannings.length;
      });
      if (allSpots.length > 0) {
        totalSpots = allSpots.reduce(function (a: any, b: any) {
          return a + b;
        });
      }
      let totalFiles = 0;
      const allFiles = data.data.map((e) => {
        return e.products.length;
      });

      if (allFiles.length > 0) {
        totalFiles = allFiles.reduce(function (a: any, b: any) {
          return a + b;
        });
      }

      return {
        stats: {
          totalItems,
          totalAnnouncers: totalAnnouncers,
          totalSpots,
          totalFiles,
        },
        results: data,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @Get('campaigns-followup')
  async getAllReport(@Query() query: FindQueryDto<CampaignDocument>) {
    try {
      let data = await this.packagesService.find();
      let totalNoInvoices = 0;
      let totalActives = 0;
      data = data.map((item: any) => {
        totalNoInvoices += item.invoice ? 0 : 1;

        const plannings = item.plannings.sort((a, b) => {
          return a.date && b.date ? (a.date < b.date ? -1 : 1) : 0;
        });

        let durationDays = 0;
        let totalDiffused = 0;
        let startDate = '';
        let endDate = '';
        let isActive = false;

        if (plannings.length > 0) {
          const d2 = new Date(plannings[plannings.length - 1].date ?? '');
          const d1 = new Date(plannings[0].date ?? '');
          const diff = Math.abs(d2.getTime() - d1.getTime());
          durationDays = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;

          totalDiffused = plannings.filter(
            (e) => e.isManualPlay === true || e.isAutoPlay === true,
          ).length;

          startDate = new Date(plannings[0].date ?? '').toLocaleDateString(
            'fr-FR',
          );
          endDate = new Date(
            plannings[plannings.length - 1].date ?? '',
          ).toLocaleDateString('fr-FR');

          if (new Date(endDate) >= new Date()) {
            totalActives += 1;
            isActive = true;
          }
        }

        return {
          ...item['_doc'],
          isActive,
          durationDays,
          startDate,
          endDate,
          totalDiffused,
        };
      });
      console.log(data[0]);
      const { isActive } = query;
      if (isActive == true) {
        data = data.filter((e: any) => e.isActive === true);
      }
      const totalItems = data.length;
      // let totalSpots = 0;
      // const allSpots = data.map((e: any) => {
      //   return e.plannings.length;
      // });
      // if (allSpots.length > 0) {
      //   totalSpots = allSpots.reduce(function (a: any, b: any) {
      //     return a + b;
      //   });
      // }

      return {
        metaData: {
          totalItems,
          totalNoInvoices: totalNoInvoices,
          totalActives: totalActives,
        },
        data,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @Get(':packageId')
  async getPackage(@Param('packageId') packageId: string) {
    try {
      return await this.packagesService.findOne(packageId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':packageId')
  async updatePackage(
    @Param('packageId') packageId: string,
    @Body() dto: UpdatePackageDto,
  ) {
    try {
      return await this.packagesService.updateOne(packageId, dto);
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':packageId/add-tv-program/:tvProgramId')
  async addTvProgram(
    @Param('packageId') packageId: string,
    @Param('tvProgramId') tvProgramId: string,
  ) {
    try {
      await this.packagesService.addTvProgram(packageId, tvProgramId);
      return await this.packagesService.findOne(packageId);
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':packageId/delete-tv-program/:tvProgramId')
  async deleteTvProgram(
    @Param('packageId') packageId: string,
    @Param('tvProgramId') tvProgramId: string,
  ) {
    try {
      await this.packagesService.deleteTvProgram(packageId, tvProgramId);
      return await this.packagesService.findOne(packageId);
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':packageId/add-hour/:hourId')
  async addHour(
    @Param('packageId') packageId: string,
    @Param('hourId') hourId: string,
  ) {
    try {
      await this.packagesService.addHour(packageId, hourId);
      return await this.packagesService.findOne(packageId);
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':packageId/delete-hour/:hourId')
  async deleteHour(
    @Param('packageId') packageId: string,
    @Param('hourId') hourId: string,
  ) {
    try {
      await this.packagesService.deleteHour(packageId, hourId);
      return await this.packagesService.findOne(packageId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':packageId/close')
  async closePackage(@Param('packageId') packageId: string) {
    try {
      return await this.packagesService.closePackage(packageId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':packageId/reopen')
  async reopenPackage(@Param('packageId') packageId: string) {
    try {
      return await this.packagesService.reopenPackage(packageId);
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':packageId/sync')
  async syncPlanning(@Param('packageId') packageId: string) {
    return await this.run(async () => {
      const myCampaign = await this.packagesService.findOne(packageId);
      let total = 0;
      for (const planning of myCampaign.plannings) {
        const updatedDate = syncDateWithHourCode(
          planning['date'],
          planning['hour']['code'] ?? planning['hour']['name'],
        );
        // console.log('sync: ' + planning['date']);
        // console.log('updated: ' + updatedDate[0]);
        if (planning['date'] != updatedDate[0]) {
          total++;
          this.planningsService.updateDate(planning['_id'], updatedDate[0]);
        }
      }
      console.log(total);
      return total;
    });
  }

  @Delete(':packageId')
  async deletePackage(@Param('packageId') packageId: string, @Req() { user }) {
    try {
      const orderPackage = await this.packagesService.findOne(packageId);
      for (let index = 0; index < orderPackage.plannings.length; index++) {
        await this.planningsService.deleteOne(
          orderPackage.plannings[index]['_id'].toString(),
        );
      }

      for (let index = 0; index < orderPackage.products.length; index++) {
        await this.productService.deleteOne(
          orderPackage.products[index]['_id'].toString(),
        );
      }
      return await this.packagesService.deleteOne(packageId, user._id);
    } catch (error) {
      sendError(error);
    }
  }
}
