import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: VerifyCallback) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: VerifyCallback) {
    const user = await this.usersService.findOne(payload.uuid);
    return done(null, user);
  }
}
