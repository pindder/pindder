import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './schemas/client.schema';
import { Brand, BrandSchema } from '../brands/schemas/brand.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Follow, FollowSchema } from './schemas/follows.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Client.name, schema: ClientSchema },
    { name: Brand.name, schema: BrandSchema },
    { name: Follow.name, schema: FollowSchema },
    { name: User.name, schema: UserSchema}
  ])],
  controllers: [ClientController],
  providers: [ClientService, JwtService],
  exports: [MongooseModule]
})
export class ClientModule {}
