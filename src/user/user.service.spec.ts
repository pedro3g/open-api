import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';

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
});
