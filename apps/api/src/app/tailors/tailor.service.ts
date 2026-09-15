import { Injectable } from '@nestjs/common';
import { CreateTailorDto } from './dto/create-tailor.dto';
import { UpdateTailorDto } from './dto/update-tailor.dto';

@Injectable()
export class TailorService {
  create(createTailorDto: CreateTailorDto) {
    return 'This action adds a new tailor';
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
