import { AuthProvider } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity {
  uuid: string;
  fullName: string;
  picture: string;
  email: string;
  provider: AuthProvider;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  id: number;

  @Exclude()
  hash: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
