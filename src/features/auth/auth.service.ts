import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('INCORRECT_EMAIL');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('INCORRECT_PASSWORD');

    return user;
  }

  login(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '30d',
      }),
    };
  }

  async register(dto: RegisterDto) {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      provider,
      country,
      appRole,
    } = dto;
    return await this.userService.create({
      email,
      password,
      phone,
      provider,
      firstName,
      lastName,
      country,
      appRole,
    });
  }
}
