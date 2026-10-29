import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Referral } from './schema/referral.schema';
import { Model } from 'mongoose';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { IResponse } from '@pindder/contracts';

@Injectable()
export class ReferralsService {
  private logger = new Logger(ReferralsService.name);

  constructor(
    @InjectModel(Referral.name) private readonly referralModel: Model<Referral>,
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>
  ) {}

  async create(createReferralDto: CreateReferralDto) {
    try {
      const tailor = await this.tailorModel.findOne({ referralCode: createReferralDto.referrer });

      if(!tailor) {
        this.logger.log('Referrer account not found!')
        return;
      }

      const referral = new this.referralModel({
        ...createReferralDto, referrer: tailor 
      });

      await referral.save()
      console.log(referral);

      if(!referral) {
        return;
      }

      return referral;
    } catch(error: any) {
      this.logger.error(error);
      return;
    }
  }

  async findAll(user_id: string) {
    try {
      const referrals = await this.referralModel.find({ 
        $and: [
          { 'referrer._id': user_id },
          { 'refereeSubscription.free': false }
        ] 
      });

      if(!referrals) {
        return new HttpException(`You do not have any successful referral.`, HttpStatus.NOT_FOUND);
      }

      const res: IResponse<any[]> = {
        statusCode: 200,
        msg: 'List of successful referrals.',
        data: referrals
      };

      return res;
    } catch(error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} referral`;
  }

  update(id: number, updateReferralDto: UpdateReferralDto) {
    return `This action updates a #${id} referral`;
  }

  remove(id: number) {
    return `This action removes a #${id} referral`;
  }
}
