import { UsersService } from './../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EnvProps } from '../../env';

export class JwtPayload {
  uuid: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get(EnvProps.JWT_SECRET_ACCESS_TOKEN),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.uuid) throw new UnauthorizedException();
    const user = await this.usersService.findOne(payload.uuid);
    if (!user) throw new UnauthorizedException();
    return payload;
  }
}
