import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UseJwt } from './auth.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalGuard } from './guards/local.guard';
import * as _ from 'lodash';
import { URequest } from 'src/common/shared/request';
import { AUTH_LOGIN_EVENT } from './auth.handler';
import { UsersService } from '../users/users.service';
import { sendError } from 'src/common/helpers';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MIN_APP_VERSION } from 'src/common/vars';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly event: EventEmitter2,
  ) {}

  @ApiBody({ type: LoginDto })
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() _req: URequest, @Body() dto: LoginDto) {
    this.event.emit(AUTH_LOGIN_EVENT, _req.user);
    const payload = _.omit(_req.user.toJSON(), [
      'password',
      'dob',
      'gender',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'trashedAt',
    ]);
    return { user: payload, ...this.authService.login(payload) };
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get('me')
  async me(@Req() _req: URequest) {
    try {
      const user = await this.usersService.findOne(_req.user._id);
      return _.omit(user.toJSON(), 'password');
    } catch (error) {
      sendError(error);
    }
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    try {
      const user = await this.usersService.create(dto);
      const payload = _.omit(user.toJSON(), [
        'password',
        'dob',
        'gender',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'trashedAt',
      ]);
      return { user: user.toJSON(), ...this.authService.login(payload) };
    } catch (error) {
      sendError(error);
    }
  }
}
