import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [PrismaService],
  imports: [UserModule, AuthModule],
})
export class AppModule {}
