import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBrandDto } from '../brands/dto/create-brand.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { Brand } from '../brands/schemas/brand.schema';
import { JwtService } from '@nestjs/jwt';
import { Client } from '../clients/schemas/client.schema';
import { CreateClientDto } from '../clients/dto/create-client.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
    private readonly jwtService: JwtService,
  ) {}

  async userLogin(loginDto: LoginDto) {
    // Implementation for user login
    const user = await this.userModel.findOne({ email: loginDto.email });

    if(!user) {
      throw new NotFoundException('User not found');
    }

    if(user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user._id, username: user.username };
    
    return {
      user: user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async userRegistration(createUserDto: CreateUserDto) {
    // Implementation for user registration
    const user = new this.userModel(createUserDto);
    await user.save();

    return user;
  }

  async brandLogin(brandLoginDto: LoginDto) {
    // Implementation for brand login
    const brand = await this.brandModel.findOne({ email: brandLoginDto.email });

    if(!brand) {
      throw new NotFoundException('Brand not found');
    }

    if(brand.password !== brandLoginDto.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: brand._id, brand: brand.brandName };
    
    return {
      user: brand,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async brandRegistration(brandCreateDto: CreateBrandDto) {
    // Implementation for brand registration
    const brand = new this.brandModel(brandCreateDto);
    await brand.save();

    return brand;
  }

  async clientLogin(loginDto: LoginDto) {
    // Implementation for brand login
    const client = await this.clientModel.findOne({ email: loginDto.email });

    if(!client) {
      throw new NotFoundException('Brand not found');
    }

    if(!client.password) {
      // send magic link to user email
    }

    if(client.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: client._id, username: client.username,  };
    
    return {
      user: client,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async clientRegistration(createClientDto: CreateClientDto) {
    // Implementation for user registration
    const client = new this.clientModel(createClientDto);
    await client.save();

    return client;
  }
}
