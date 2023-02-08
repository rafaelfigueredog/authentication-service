import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignupAuthDto {
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @MinLength(6)
  @MaxLength(12)
  @ApiProperty()
  password: string;
}
