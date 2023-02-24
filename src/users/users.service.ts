import { AuthProvider } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { CreateUser, UpdateUser } from './interfaces';
import { PrismaService } from '../prisma';
import { ApiTags } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';

@Injectable()
@ApiTags('Users')
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUser): Promise<UserEntity> {
    const user = await this.prisma.user.create({ data });
    return new UserEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserEntity(user));
  }

  async findOne(uuid: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { uuid },
    });

    return user ? new UserEntity(user) : null;
  }

  async update(uuid: string, data: UpdateUser) {
    const user = await this.prisma.user.update({
      where: { uuid },
      data,
    });
    return new UserEntity(user);
  }

  async remove(uuid: string) {
    const user = await this.prisma.user.delete({ where: { uuid } });
    return new UserEntity(user);
  }

  async findBy(email: string, provider: AuthProvider) {
    const user = await this.prisma.user.findFirst({
      where: { email, provider },
    });

    return user;
  }

  async findOrCreate(profile: CreateUser) {
    const user = await this.prisma.user.upsert({
      where: { email: profile.email },
      create: profile,
      update: {},
    });

    return new UserEntity(user);
  }
}
