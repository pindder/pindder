import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login-user')
  userLogin() {
    return this.appService.userLogin();
  }

  @Post('register-user')
  userRegistration() {
    return this.appService.userRegistration();
  }

  @Post('login-brand')
  brandLogin() {
    return this.appService.brandLogin();
  }

  @Post('register-brand')
  brandRegistration() {
    return this.appService.brandRegistration();
  }
}
