import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthProvider } from '@prisma/client';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SignupAuthDto, SigninAuthDto, GoogleUserProfile } from './dto';
import { EnvProps } from '../env';

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async generateAccessToken(user: UserEntity) {
    const payload = { uuid: user.uuid, email: user.email };
    const secret = this.config.get(EnvProps.JWT_SECRET_ACCESS_TOKEN);
    const expiresIn = '24h';

    return this.jwt.signAsync(payload, { secret, expiresIn });
  }

  async generatePasswordHash(password: string): Promise<string> {
    return argon.hash(password);
  }

  async verifyPassword(password: string, userHash: string) {
    return argon.verify(userHash, password);
  }

  async signinWithGoogle(user: UserEntity) {
    return this.generateAccessToken(user);
  }

  async validateUser(email: string, password: string, provider: AuthProvider) {
    try {
      const user = await this.usersService.findBy(email, provider);

      if (!user || !this.verifyPassword(password, user.hash)) {
        throw new UnauthorizedException();
      }

      return new UserEntity(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async signinWithEmail({ email, password }: SigninAuthDto) {
    try {
      const user = await this.validateUser(email, password, AuthProvider.LOCAL);
      return this.generateAccessToken(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async signupWithEmail({ fullName, email, password }: SignupAuthDto) {
    try {
      const hash = await this.generatePasswordHash(password);

      const user = await this.usersService.create({
        fullName,
        email,
        hash,
      });

      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async validateGoogleUser({ fullName, email, picture }: GoogleUserProfile) {
    try {
      const user = await this.usersService.findOrCreate({
        provider: AuthProvider.GOOGLE,
        fullName,
        picture,
        email,
      });

      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
