import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Plan } from './schema/plan.schema';
import { Model } from 'mongoose';
import { IResponse } from '@pindder/contracts';

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name);
  private url = this.configService.get<string>('PAYSTACK_BASE_URL') || 'https://api.paystack.co';

  private headers = {
    Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
    'Content-Type': 'application/json',
  };

  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectModel(Plan.name) private readonly planModel: Model<Plan>
  ) {}

  async create(createPlanDto: CreatePlanDto, type?: string) {
    try {
      const { features, recommended, free, ...planDto} = createPlanDto

      if(features.length < 2) {
        throw new BadRequestException(`A plan must have at least two features`);
      }

      let newPlan = new this.planModel();

      if(type || createPlanDto.amount < 100) {
        const freePlan = await this.planModel.findOne({ free: true });

        if(freePlan) {
          throw new ConflictException(`You can have only one free plan!`);
        }
        
        newPlan.name = createPlanDto.name;
        newPlan.interval = createPlanDto.interval;
        newPlan.plan_id = 1;
        newPlan.plan_code = 'PLN_8690x10a83v0312';
        newPlan.features = features;
        newPlan.free = true;
        newPlan.amount = createPlanDto.amount;
        if(createPlanDto.description) newPlan.description = createPlanDto.description; 
        if(createPlanDto.recommended) newPlan.recommended = createPlanDto.recommended;

        await newPlan.save();
      } else {
        const amountInKobo = createPlanDto.amount * 100;

        if(free) createPlanDto.free = free;
        
        const response = await firstValueFrom(
          this.httpService.post(
            `${this.url}/plan`, 
            {...planDto, amount: amountInKobo }, 
            { headers: this.headers }
          ),
        );

        // Returns object containing plan_code (e.g., PLN_8690x10a83v0312)
        newPlan = await this.planModel.create({
          ...createPlanDto,
          ...response.data.data,
          metadata: response.data.data,
          plan_id: response.data.data.id,
          amount: createPlanDto.amount,
          recommended: recommended ?? false
        });

        this.logger.log('Plan created successfully on Paystack plans', response.data.data);
      }

      const res: IResponse<Plan> = {
        statusCode: 200,
        msg: 'Plan created successfully',
        data: newPlan
      };

      return res;
    } catch (error: any) {
      this.logger.error('Failed to create Paystack plan', error.response?.data);
      throw error;
    } 
  }

  // async synchronizePlans() {

  // }

  async findAll() {
    try {
      const plans = await this.planModel.find();

      if(!plans) {
        throw new NotFoundException(`No available plans at this time!`);
      }

      const res: IResponse<Plan[]> = {
        statusCode: 200,
        msg: 'List of available plans',
        data: plans
      };

      return res;
    } catch(error: any) {
      this.logger.log(error);
      throw new InternalServerErrorException(`${error}`);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
