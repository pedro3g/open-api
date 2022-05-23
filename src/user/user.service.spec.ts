import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';
import { hashSync } from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('search for a user by id', async () => {
    const mockUser: User = {
      id: 'abc-123',
      email: 'user@email.com',
      name: 'User',
      password: 'user123',
    };

    prismaService.user.findUnique = jest.fn().mockReturnValueOnce(mockUser);

    expect(await userService.findUnique({ id: mockUser.id })).toEqual(mockUser);
  });

  it('insert a user into the database', async () => {
    const mockUser: User = {
      id: 'abc-123',
      email: 'user@email.com',
      name: 'User',
      password: 'user123',
    };

    prismaService.user.create = jest.fn().mockReturnValueOnce(mockUser);

    expect(await userService.create(mockUser)).toEqual(mockUser);
  });

  it('validate user password', async () => {
    const mockUser: User = {
      id: 'abc-123',
      email: 'user@email.com',
      name: 'User',
      password: hashSync('user123', 10),
    };

    prismaService.user.findUnique = jest.fn().mockReturnValueOnce(mockUser);

    expect(
      await userService.validateUser({
        email: mockUser.email,
        password: 'user123',
      }),
    ).toEqual(mockUser);
    expect(
      await userService.validateUser({
        email: mockUser.email,
        password: 'user12',
      }),
    ).toEqual(null);
  });
});
