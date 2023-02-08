import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { EnvProps } from '../../env';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>(EnvProps.GOOGLE_CLIENT_ID),
      clientSecret: configService.get<string>(EnvProps.GOOGLE_CLIENT_SECRET),
      callbackURL: configService.get<string>(EnvProps.GOOGLE_CALLBACK_URL),
      scope: ['profile', 'email'],
    });
  }

  private getUserProfileInfo(profile: Profile) {
    const fullName = profile.displayName;
    const email = profile._json.email;
    const picture = profile._json.picture;

    return {
      fullName,
      email,
      picture,
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      const userInfo = this.getUserProfileInfo(profile);

      const user = await this.authService.validateGoogleUser({
        ...userInfo,
        accessToken,
      });

      return done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
