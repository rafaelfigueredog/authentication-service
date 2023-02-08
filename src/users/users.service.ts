import { AuthProvider } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateUser, UpdateUser } from './interfaces';
import { PrismaService } from '../prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUser): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.create({ data });
      return new UserEntity(user);
    } catch (err) {
      throw new ServiceUnavailableException();
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      const users = await this.prisma.user.findMany();
      return users.map((user) => new UserEntity(user));
    } catch (err) {
      throw new ServiceUnavailableException();
    }
  }

  async findOne(uuid: string): Promise<UserEntity | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { uuid },
      });

      return user ? new UserEntity(user) : null;
    } catch (err) {
      throw new ServiceUnavailableException();
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
      throw new ServiceUnavailableException();
    }
  }

  async remove(uuid: string) {
    try {
      const user = await this.prisma.user.delete({ where: { uuid } });
      return new UserEntity(user);
    } catch (err) {
      throw new ServiceUnavailableException();
    }
  }

  async findBy(email: string, provider: AuthProvider) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email, provider },
      });

      return user;
    } catch (err) {
      throw new ServiceUnavailableException();
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
      throw new ServiceUnavailableException();
    }
  }
}
