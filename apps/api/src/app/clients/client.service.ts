import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from './schemas/client.schema';
import { Model } from 'mongoose';
import { Follow } from './schemas/follows.schema';
import { User } from '../users/schemas/user.schema';
import { ClientAssociationDto } from './dto/client-association.dto';
import { IResponse } from '@pindder/contracts';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
    @InjectModel(Client.name) private readonly clientModel:  Model<Client>
  ) {}

  async create(createClientDto: CreateClientDto, referee_id?: string) {
    try{
      //check if the email already is in the system
      const existing_client = await this.clientModel
      .findOne({ email: createClientDto.email })
      .select('_id firstname lastname email phoneNo')
      .exec();
      
      const existing_user = await this.userModel.findOne({ email: createClientDto.email }); 

      if(existing_client || existing_user) {

        const res = { 
          client: existing_user ?? existing_client, 
          message: `The email provided currently exists on pindder,
          would you like to verify the information and add the client to your client list?`
        }

        return res;
      }

      const client = new this.clientModel(createClientDto);
      client.fullname = client.firstname + ' ' + client.lastname;
      client.referee = referee_id;

      await client.save();

      const new_follow = new this.followModel({
        client: client._id,
        tailor: client.referee
      });

      await new_follow.save();
      
      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Client added successfully.',
        data: client
      };

      return res;
    } catch (error: any) {
      console.error(error);
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
            referee: user_id
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

    }
  }

  async findAll(acct_id: string) {
    try {
      const clients = await this.clientModel
      .find({ referee: acct_id })
      .populate('referee', '-_v')
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
