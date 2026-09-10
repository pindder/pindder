import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from './schemas/client.schema';
import { Model } from 'mongoose';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel:  Model<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const client = new this.clientModel(createClientDto);
    client.fullname = client.firstname + ' ' + client.lastname;
    client.username = client.email.split('@')[0]; 
    await client.save();

    return client._id;
  }

  async findAll() {
    const clients = await this.clientModel
      .find()
      .populate('referee', '-_v')
      .exec();

    if(clients.length < 1) {
      throw new HttpException('No client data found!', HttpStatus.NO_CONTENT);
    }
    return clients;
  }

  async findOne(id: string) {
    const client = await this.clientModel.findById(id);

    if(!client) {
      throw new HttpException('Profile not found!', HttpStatus.NOT_FOUND);
    }

    return client;
  }

  update(id: string, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
