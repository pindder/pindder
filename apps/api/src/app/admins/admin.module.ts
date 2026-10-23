import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema }
    ]),
    SharedModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [MongooseModule, AdminService]
})
export class AdminModule {}
