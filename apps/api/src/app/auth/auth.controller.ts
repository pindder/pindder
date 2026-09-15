import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateBrandDto } from '../brands/dto/create-brand.dto';
import { CreateTailorDto } from '../tailors/dto/create-tailor.dto';
import { IVerification } from '@pindder/contracts';

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

  @Post('login-tailor')
  tailorLogin(@Body() loginDto: LoginDto) {
    return this.authService.tailorLogin(loginDto);
  }

  @Post('register-tailor')
  tailorRegistration(@Body() tailorCreateDto: CreateTailorDto) {
    return this.authService.tailorRegistration(tailorCreateDto);
  }

  @Post('verify-code')
  verifyCode(@Body() verificationDto: IVerification) {
    return this.authService.verifyOneTimeLoginCode(verificationDto);
  }
}
