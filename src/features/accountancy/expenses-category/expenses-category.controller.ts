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
import { sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../../auth/auth.decorator';
import { ExpenseCategoryService } from './expenses-category.service';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';

// import { FirebaseService } from '../firebase/firebase.service';

@Controller('expense-categories')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Expense Categories')
export class ExpenseCategoryController extends BaseController {
  private logger = new Logger(ExpenseCategoryController.name);

  constructor(
    private readonly expenseCategoryServices: ExpenseCategoryService,
  ) {
    super();
  }

  async updateExpenseCategory(
    @Body() dto: UpdateExpenseCategoryDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.expenseCategoryServices.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.expenseCategoryServices.find();
      return result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        if (json['parent']) {
          json['parent']['_id'] = json['parent']['_id'].toString();
        }

        return json;
      });
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':expenseCategoryId')
  async getAccount(@Param('expenseCategoryId') expenseCategoryId: string) {
    return await this.run(async () => {
      const result = (
        await this.expenseCategoryServices.findOne(expenseCategoryId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createExpenseCategory(@Body() dto: CreateExpenseCategoryDto) {
    try {
      return (await this.expenseCategoryServices.create(dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':expenseCategoryId')
  async updateAccount(
    @Param('expenseCategoryId') accountId: string,
    @Body() dto: UpdateExpenseCategoryDto,
  ) {
    try {
      return (
        await this.expenseCategoryServices.update(accountId, dto)
      ).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':expenseCategoryId')
  async deleteExpenseCategory(
    @Param('expenseCategoryId') expenseCategoryId: string,
  ) {
    return await this.run(async () => {
      return await this.expenseCategoryServices.deleteOne(expenseCategoryId);
    });
  }
}
