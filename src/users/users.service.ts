import { AuthProvider } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { CreateUser, UpdateUser } from './interfaces';
import { PrismaService } from '../prisma';
import { ApiTags } from '@nestjs/swagger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import {
  ForbiddenException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
@ApiTags('Users')
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUser): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.create({ data });
      return new UserEntity(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken', { cause: error });
        }
      }

      throw new BadRequestException();
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      const users = await this.prisma.user.findMany();
      return users.map((user) => new UserEntity(user));
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findOne(uuid: string): Promise<UserEntity | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { uuid },
      });

      return user ? new UserEntity(user) : null;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async update(uuid: string, data: UpdateUser) {
    try {
      const user = await this.prisma.user.update({
        where: { uuid },
        data,
      });
      return new UserEntity(user);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async remove(uuid: string) {
    try {
      const user = await this.prisma.user.delete({ where: { uuid } });
      return new UserEntity(user);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findBy(email: string, provider: AuthProvider) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email, provider },
      });

      return user;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findOrCreate(profile: CreateUser) {
    try {
      const user = await this.prisma.user.upsert({
        where: { email: profile.email },
        create: profile,
        update: {},
      });

      return new UserEntity(user);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
