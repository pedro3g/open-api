import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync, compareSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findUnique(data: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: data });
  }

  async create({
    email,
    name,
    password,
  }: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashSync(password, 10),
      },
    });
  }

  async validateUser({
    email,
    password,
  }: Pick<User, 'email' | 'password'>): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!compareSync(password, user?.password || '')) return null;

    return user;
  }
}
