import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SigninAuthDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(6)
  @MaxLength(12)
  password: string;
}

export class GoogleUserProfile {
  fullName: string;
  email: string;
  picture: string;
  accessToken: string;
}
