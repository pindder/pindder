import { Injectable, UseGuards } from '@nestjs/common';
import { CreateTailorDto } from './dto/create-tailor.dto';
import { UpdateTailorDto } from './dto/update-tailor.dto';
import { AuthGuard } from '../auth/auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Tailor } from './schemas/tailor.schema';
import { Model } from 'mongoose';

@Injectable()
export class TailorService {
  constructor(
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>
  ) {}
  
  @UseGuards(AuthGuard)
  async create(createTailorDto: CreateTailorDto) {
    
    const tailor = await this.tailorModel.create(createTailorDto);
    return tailor;
  }

  findAll() {
    return `This action returns all tailor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tailor`;
  }

  update(id: number, updateTailorDto: UpdateTailorDto) {
    return `This action updates a #${id} tailor`;
  }

  remove(id: number) {
    return `This action removes a #${id} tailor`;
  }
}
