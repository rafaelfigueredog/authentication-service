import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthProvider } from '@prisma/client';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SignupAuthDto, SigninAuthDto, GoogleUserProfile } from './dto';
import { HashService } from './hash/hash.service';
import { EnvProps } from '../env';

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly hashService: HashService,
  ) {}

  async generateAccessToken(user: UserEntity) {
    const payload = { uuid: user.uuid, email: user.email };
    const secret = this.config.get(EnvProps.JWT_SECRET_ACCESS_TOKEN);
    const expiresIn = '24h';

    return this.jwt.signAsync(payload, { secret, expiresIn });
  }

  async signinWithGoogle(user: UserEntity) {
    return this.generateAccessToken(user);
  }

  async validateUser(email: string, password: string, provider: AuthProvider) {
    try {
      const user = await this.usersService.findBy(email, provider);

      if (!user || !this.hashService.verify(user.hash, password)) {
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
      const accessToken = await this.generateAccessToken(user);
      return { accessToken };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async signupWithEmail({ fullName, email, password }: SignupAuthDto) {
    try {
      const hash = await this.hashService.create(password);

      const user = await this.usersService.create({
        fullName,
        email,
        hash,
      });

      return user;
    } catch (error) {
      throw new BadRequestException(error, { cause: error });
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
