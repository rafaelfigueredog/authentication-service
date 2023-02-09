import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleAuthStrategy, JwtAuthStrategy } from './strategies';
import { SessionSerializer } from './serializers';
import { UsersService } from '../users/users.service';
import { HashModule } from './hash/hash.module';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({ session: true }),
    HashModule,
  ],
  controllers: [AuthController],
  providers: [
    UsersService,
    AuthService,
    JwtAuthStrategy,
    GoogleAuthStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
