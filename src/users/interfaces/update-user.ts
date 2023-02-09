import { IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateUser } from './create-user';

export class UpdateUser extends PartialType(CreateUser) {
  @IsOptional()
  fullName?: string;

  @IsOptional()
  email?: string;
}
