import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoginAuthService } from './login-auth.service';
import { LoginAuthDto } from './dto/create-login-auth.dto';



@Controller('login-auth')
export class LoginAuthController {
  constructor(private readonly loginAuthService: LoginAuthService) {}

  @Post('/login')
  async LoginUser(@Body() DataUserLogin:LoginAuthDto) {
    const response = await this.loginAuthService.LoginUser(DataUserLogin);
    
    return response;
  }

}
