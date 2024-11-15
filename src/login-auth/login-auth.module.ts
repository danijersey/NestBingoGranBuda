import { Module } from '@nestjs/common';
import { LoginAuthService } from './login-auth.service';
import { LoginAuthController } from './login-auth.controller';
import { LoginAuthRepository } from './repositorys/login-auth.repository';

@Module({
  controllers: [LoginAuthController],
  providers: [LoginAuthService,LoginAuthRepository],
})
export class LoginAuthModule {}
