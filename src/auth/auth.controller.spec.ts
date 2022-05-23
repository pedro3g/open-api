import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import * as request from 'supertest';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let app: INestApplication;
  let authController: AuthController;

  const mockDefaultUser: User = {
    id: 'abc-123',
    email: 'user@email.com',
    name: 'User',
    password: hashSync('user123', 10),
  };

  const mockUserService = {
    findUnique: () => mockDefaultUser,
    create: () => mockDefaultUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    authController = module.get<AuthController>(AuthController);

    app = module.createNestApplication();
    app.init();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('POST /auth/register - create user successfully', async () => {
    const mockUser: User = {
      id: 'abc-123',
      email: 'user@email.com',
      name: 'User',
      password: 'user123',
    };

    jest
      .spyOn(mockUserService, 'findUnique')
      .mockImplementationOnce(() => null);

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(mockUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toEqual({
      id: 'abc-123',
      email: 'user@email.com',
      name: 'User',
    });
  });

  it('POST /auth/register - email formatting error', () => {
    const mockUser: User = {
      id: 'abc-123',
      email: 'useremail.com',
      name: 'User',
      password: 'user123',
    };

    jest
      .spyOn(mockUserService, 'findUnique')
      .mockImplementationOnce(() => null);

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(mockUser)
      .expect(400)
      .expect(
        new BadRequestException({
          status: 'error.invalidField',
          fields: ['email'],
        }).getResponse(),
      );
  });

  it('POST /auth/register - name field formatting less than 3', () => {
    const mockUser: User = {
      id: 'abc-123',
      email: 'user@email.com',
      name: 'Us',
      password: 'user123',
    };

    jest
      .spyOn(mockUserService, 'findUnique')
      .mockImplementationOnce(() => null);

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(mockUser)
      .expect(400)
      .expect(
        new BadRequestException({
          status: 'error.invalidField',
          fields: ['name'],
        }).getResponse(),
      );
  });

  it('POST /auth/register - name field formatting greater than 3', () => {
    const mockUser: User = {
      id: 'abc-123',
      email: 'user@email.com',
      name: 'a'.repeat(256),
      password: 'user123',
    };

    jest
      .spyOn(mockUserService, 'findUnique')
      .mockImplementationOnce(() => null);

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(mockUser)
      .expect(400)
      .expect(
        new BadRequestException({
          status: 'error.invalidField',
          fields: ['name'],
        }).getResponse(),
      );
  });

  it('POST /auth/register - password field formatting less than 3', () => {
    const mockUser: User = {
      id: 'abc-123',
      email: 'user@email.com',
      name: 'User',
      password: 'user1',
    };

    jest
      .spyOn(mockUserService, 'findUnique')
      .mockImplementationOnce(() => null);

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(mockUser)
      .expect(400)
      .expect(
        new BadRequestException({
          status: 'error.invalidField',
          fields: ['password'],
        }).getResponse(),
      );
  });

  it('POST /auth/register - password field formatting greater than 3', () => {
    const mockUser: User = {
      id: 'abc-123',
      email: 'user@email.com',
      name: 'User',
      password: 'a'.repeat(256),
    };

    jest
      .spyOn(mockUserService, 'findUnique')
      .mockImplementationOnce(() => null);

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(mockUser)
      .expect(400)
      .expect(
        new BadRequestException({
          status: 'error.invalidField',
          fields: ['password'],
        }).getResponse(),
      );
  });
});
