import { Injectable } from '@nestjs/common';
import {  LoginAuthDto } from './dto/create-login-auth.dto';
import { LoginAuthRepository } from './repositorys/login-auth.repository';


@Injectable()
export class LoginAuthService {

constructor(
  private LoginAuthRepository:LoginAuthRepository
){}

  async LoginUser(DataUserLogin: LoginAuthDto) {
    return await this.LoginAuthRepository.AuthLogin(DataUserLogin)
  }

}
