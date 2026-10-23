import { Injectable, Logger, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateTailorDto } from './dto/create-tailor.dto';
import { UpdateTailorDto } from './dto/update-tailor.dto';
import { AuthGuard } from '../auth/auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { ITailorModel, Tailor } from './schemas/tailor.schema';
import { IResponse } from '@pindder/contracts';

@Injectable()
export class TailorService {
  private logger = new Logger(TailorService.name);

  constructor(
    @InjectModel(Tailor.name) private readonly tailorModel: ITailorModel
  ) {}
  
  @UseGuards(AuthGuard)
  async create(createTailorDto: CreateTailorDto) {
    
    const tailor = await this.tailorModel.create(createTailorDto);
    return tailor;
  }

  async findAll() {
    try {
      const tailors = await this.tailorModel.getAllTailorsWithStats();

      if(!tailors){
        throw new NotFoundException(`No tailor information was found in the DB!`);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'List of Tailors',
        data: tailors
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const tailor = await this.tailorModel.getTailorWithStats(id);

      if(!tailor){
        throw new NotFoundException(`Tailor not found in the DB!`);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'List of Tailors',
        data: tailor
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      return error;
    }
  }

  update(id: string, updateTailorDto: UpdateTailorDto) {
    return `This action updates a #${id} tailor`;
  }

  remove(id: string) {
    return `This action removes a #${id} tailor`;
  }
}
