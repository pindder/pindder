import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from './schemas/client.schema';
import { Model } from 'mongoose';
import { Follow } from './schemas/follows.schema';
import { ClientAssociationDto } from './dto/client-association.dto';
import { DataTypes, DataTypesIcon, IResponse, NotificationActions } from '@pindder/contracts';
import { NotificationService } from '../notifications/notification.service';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { MeasurementService } from '../measurements/measurement.service';

@Injectable()
export class ClientService {
  private logger = new Logger(ClientService.name);

  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
    @InjectModel(Client.name) private readonly clientModel:  Model<Client>,
    @InjectModel(Tailor.name) private readonly tailorModel: Model<Tailor>,
    private readonly notificationService: NotificationService,
    private readonly measurementService: MeasurementService
  ) {}

  async create(createClientDto: CreateClientDto, referee_id?: string) {
    try{
      const tailor = await this.tailorModel.findById(referee_id).exec();

      if(!tailor) {
        throw new NotFoundException(`Designer account not found!`);
      }

      const client = new this.clientModel(createClientDto);
      client.fullname = client.firstname + ' ' + client.lastname;
      client.referee = tailor;

      await client.save();
      
      //if measurement was provided create it
      if(createClientDto.measurements && createClientDto.measurements.length > 0) {
        const measurements = createClientDto.measurements.map(m => ({
          ...m,
          owner: client.toObject()
        }));
        await this.measurementService.createBulkMeasurements(measurements);
      }

      await this.notificationService.create({
        dependent: client,
        initiator: client.referee,
        type: DataTypes.CLIENT,
        action: NotificationActions.CLIENT_CREATED,
        icon: DataTypesIcon.CLIENT,
        title: 'New Client',
        message: `${client.fullname} has been added to your client created.`,
        data: {
          ...client
        },
      });
      
      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Client added successfully.',
        data: client
      };

      return res;
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async search(query: string, user_id: string) {
    try {
      const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(sanitizedQuery, 'i');

      const clients = await this.clientModel.find({
        $or: [
          { email: searchRegex },
          { firstname: searchRegex },
          { fullname: searchRegex },
          { lastname: searchRegex },
          { phoneNo: searchRegex }
        ],
        $and: [
          {
            'referee._id': user_id
          }
        ]
      }).exec();

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'List of clients',
        data: clients
      }

      return res;

    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async addExistingClientToTailor(clientAssociationDto: ClientAssociationDto) {
    try {
      const client = await this.clientModel.findById(clientAssociationDto.client);

      if(client) {
        const new_follow = new this.followModel({
          client: client._id,
          tailor: client.referee
        });
        await new_follow.save();

        throw new HttpException('', HttpStatus.CONFLICT);

      }
    } catch(error: any) {
      return;
    }
  }

  async findAll(acct_id: string) {
    try {
      const clients = await this.clientModel
      .find({ 'referee._id': acct_id })
      .sort({ createdAt: -1 })
      .exec();

      // 1. Throw directly instead of returning
      if (!clients || clients.length === 0) {
        throw new NotFoundException(`No clients found`);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'List of clients',
        data: clients
      }

      return res;
    } catch(error: any) {
      // 2. If it's already an HTTP exception (like NotFoundException), re-throw it as-is
      if (error instanceof NotFoundException) {
        throw error;
      }

      // 3. Pass error.message instead of template stringifying the whole object
      console.error('Error fetching clients:', error);
      throw new InternalServerErrorException(error?.message || 'Failed to retrieve clients');
    }
  }

  async findOne(id: string) {
    try {
      const client = await this.clientModel.findById(id);

      if(!client) {
        throw new HttpException('Profile not found!', HttpStatus.NOT_FOUND);
      }

      const res: IResponse<any> = {
        statusCode: 200,
        msg: '',
        data: client
      }

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      const client = await this.clientModel.findByIdAndUpdate(id, updateClientDto, { upsert: true, returnDocument: 'after' });
      
      const res: IResponse<any> = {
        statusCode: 200, 
        msg: 'Client updated successfully.',
        data: client
      }

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async remove(id: string) {
    try {
      await this.measurementService.bulkDelete(id);
      const client = await this.clientModel.findByIdAndDelete(id);


      const res: IResponse<any> = {
        statusCode: 200,
        msg: "The client was removed successfully.",
        data: client?._id
      }

      return res;
    } catch(error: any) {
      throw new InternalServerErrorException();
    }
  }
}
