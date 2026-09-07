import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  userLogin(): { message: string } {
    return { message: 'User login successful' };
  }

  userRegistration(): { message: string } {
    return { message: 'User registration successful' };
  }

  brandLogin(): { message: string } {
    return { message: 'Brand login successful' };
  }

  brandRegistration(): { message: string } {
    return { message: 'Brand registration successful' };
  }
}
