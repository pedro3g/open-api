import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { sign } from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() { name, email, password }: User) {
    const errorFields: string[] = [];

    if (await this.userService.findUnique({ email })) {
      throw new BadRequestException({
        status: 'error.userAlreadyExists',
      });
    }

    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      )
    ) {
      errorFields.push('email');
    }
    if (name.length < 3 || name.length > 255) {
      errorFields.push('name');
    }
    if (password.length < 6 || password.length > 255) {
      errorFields.push('password');
    }

    if (!!errorFields.length) {
      throw new BadRequestException({
        status: 'error.invalidField',
        fields: errorFields.sort(),
      });
    }

    const user = await this.userService.create({ name, email, password });

    return {
      token: sign(
        {
          id: user.id,
          emal: user.email,
        },
        process.env.JWT_KEY,
      ),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
