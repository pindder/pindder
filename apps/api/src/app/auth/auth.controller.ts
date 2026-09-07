import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateBrandDto } from '../brands/dto/create-brand.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-user')
  userLogin(@Body() loginDto: LoginDto) {
    return this.authService.userLogin(loginDto);
  }

  @Post('register-user')
  userRegistration(@Body() createUserDto: CreateUserDto) {
    return this.authService.userRegistration(createUserDto);
  }

  @Post('login-brand')
  brandLogin(@Body() loginDto: LoginDto) {
    return this.authService.brandLogin(loginDto);
  }

  @Post('register-brand')
  brandRegistration(@Body() brandCreateDto: CreateBrandDto) {
    return this.authService.brandRegistration(brandCreateDto);
  }
}
