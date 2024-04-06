import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';
import { genCode, sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../auth/auth.decorator';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Controller('suppliers')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Suppliers')
export class SuppliersController extends BaseController {
  private logger = new Logger(SuppliersController.name);

  constructor(private readonly suppliersService: SuppliersService) {
    super();
  }

  async updateSupplier(
    @Body() dto: UpdateSupplierDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.suppliersService.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.suppliersService.find();
      const final_result = result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        if (json['country']) {
          json['country']['_id'] = json['country']['_id'].toString();
        }
        json['notifications'] = [];
        return json;
      });

      return final_result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get('all/light')
  async getAllLight() {
    return await this.run(async () => {
      const result = await this.suppliersService.findLight();
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':supplierId')
  async getAccount(@Param('supplierId') supplierId: string) {
    return await this.run(async () => {
      const result = (await this.suppliersService.findOne(supplierId)).toJSON();
      console.log(result);
      return _.omit(result, ['password', 'notifications']);
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createSupplier(@Body() dto: CreateSupplierDto) {
    try {
      const oneSupplier = await this.suppliersService.findByName(dto.name);
      if (oneSupplier) {
        throw new HttpException(
          'Supplier name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const allSuppliers = await this.suppliersService.findAll();
      const supplier = (
        await this.suppliersService.create({
          ...dto,
          code: 'F' + genCode(allSuppliers.length + 1, 5),
        })
      ).toJSON();
      return supplier;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':supplierId')
  async updateAccount(
    @Param('supplierId') accountId: string,
    @Body() dto: UpdateSupplierDto,
  ) {
    try {
      const supplier = await (
        await this.suppliersService.update(accountId, dto)
      ).toJSON();
      return {
        name: supplier.name,
        phone: supplier.phone,
        type: supplier.type,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':supplierId')
  async deleteSupplier(
    @Param('supplierId') supplierId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.suppliersService.deleteOne(supplierId);
    });
  }
}
