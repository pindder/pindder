import {
  Controller,
  Sse,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  MessageEvent,
  Header,
  InternalServerErrorException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { IResponse } from '@pindder/contracts';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * SSE Stream endpoint.
   * Client connects via: new EventSource('/api/notifications/stream/USER_ID')
   */
  // @UseGuards(JwtAuthGuard)
  @Sse('stream/:userId')
  @Header('Cache-Control', 'no-cache, no-transform')
  @Header('X-Accel-Buffering', 'no') // Disables buffering in Nginx / Render proxies
  @Header('Content-Type', 'text/event-stream')
  streamNotifications(@Param('userId') userId: string): Observable<MessageEvent> {
    return this.notificationService.getNotificationStream(userId);
  }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Get('account/:id')
  async findAccountNotifications(@Param('id') id: string) {
    
    const result = await this.notificationService.findAccountNotifications(id);
    
    if(result instanceof InternalServerErrorException) {
      throw new InternalServerErrorException(`$result`);
    } else {
      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Notifications List.',
        data: result
      };

      return res;
    }
  }

  @Get('account/:id/recent')
  async findAccountRecentNotifications(@Param('id') id: string) {
    
    const result = await this.notificationService.findAccountRecentNotifications(id);
    
    if(result instanceof InternalServerErrorException) {
      throw new InternalServerErrorException(`$result`);
    } else {
      const res: IResponse<any> = {
        statusCode: 200,
        msg: 'Notifications List.',
        data: result
      };

      return res;
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
