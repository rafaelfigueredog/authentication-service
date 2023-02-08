import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupAuthDto, SigninAuthDto } from './dto';
import { GoogleAuthGuard } from './guard';

// Route: api/auth
@ApiTags('Authentications')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signupWithEmail(@Body() signupDto: SignupAuthDto) {
    return this.authService.signupWithEmail(signupDto);
  }

  @Post('signin')
  signinWithEmail(@Body() signinDto: SigninAuthDto) {
    return this.authService.signinWithEmail(signinDto);
  }

  @Get('google/signin')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Guards Redirects
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.signinWithGoogle(req.user);
  }
}
