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
import { sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../auth/auth.decorator';
import { FetchAccountsDto } from './dto/fetch-accounts.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { SALT_ROUND } from 'src/common/vars';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Users')
export class UsersController extends BaseController {
  private logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {
    super();
  }

  async updateUser(@Body() dto: UpdateUserDto, @Req() { user }: URequest) {
    return await this.run(
      async () => await this.usersService.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAllAccount() {
    return await this.run(async () => {
      const result = await this.usersService.find();
      const final_result = result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        json['notifications'] = [];
        return json;
      });

      return final_result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':userId')
  async getAccount(@Param('userId') userId: string) {
    return await this.run(async () => {
      const result = (await this.usersService.findOne(userId)).toJSON();
      console.log(result);
      return _.omit(result, ['password', 'notifications']);
    });
  }

  // @Put('password-reset')
  // async passwordReset(@Body() dto: UpdatePasswordDto) {
  //   return await this.run(async () => {
  //     const { phone, password, idToken } = dto;
  //     try {
  //       await this.firebaseService.verifyIdToken(idToken);
  //     } catch (error) {
  //       throw new UnauthorizedException(error);
  //     }

  //     const user = (
  //       await this.usersService.resetPassword(phone, password)
  //     ).toJSON();
  //     user['notifications'] = [];
  //     user['password'] = null;
  //     user['_id'] = user['_id'].toString();

  //     return user;
  //   });
  // }

  @ApiBearerAuth()
  @UseJwt()
  @Put('admin-password-reset')
  async adminPasswordReset(@Body() dto: UpdatePasswordDto) {
    return await this.run(async () => {
      const { email, password } = dto;
      const user = (
        await this.usersService.resetPassword(email, password)
      ).toJSON();
      user['notifications'] = [];
      user['password'] = null;
      user['_id'] = user['_id'].toString();

      return user;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put('user-password-reset')
  async userPasswordReset(
    @Body() dto: UpdatePasswordDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      const { email, oldPassword, password } = dto;
      const account = await this.usersService.findOne(user._id);
      const isMatch = await bcrypt.compare(oldPassword, account.password);
      if (isMatch) {
        const result = (
          await this.usersService.resetPassword(email, password)
        ).toJSON();
        result['notifications'] = [];
        result['password'] = null;
        result['_id'] = result['_id'].toString();

        return result;
      } else {
        throw new HttpException('PASSWORDS_DO_NOT_MATCH', HttpStatus.FORBIDDEN);
      }
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':userId')
  async updateAccount(
    @Param('userId') accountId: string,
    @Body() dto: UpdateUserDto,
    // @Req() { user },
  ) {
    try {
      const user = await (
        await this.usersService.update(accountId, dto)
      ).toJSON();
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        team: user.team,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @Get('phone/:phone')
  async checkPhone(@Param('phone') phone: string) {
    try {
      const account = await this.usersService.phoneExists(phone);
      return { exists: true, ...account };
    } catch (error) {
      return { exists: false };
    }
  }

  @Post('/fetch')
  async fetchAccountsByPhone(@Body() { phones }: FetchAccountsDto) {
    return await this.run(async () => {
      const _phones = phones.replace(/[^\w\s\,]/gi, '').split(',');
      return await this.usersService.findByPhones(_phones);
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':userId')
  async deleteRole(@Param('userId') userId: string, @Req() { user }: URequest) {
    return await this.run(async () => {
      return await this.usersService.deleteOne(userId);
    });
  }
}
