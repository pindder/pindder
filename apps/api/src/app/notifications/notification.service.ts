import { Injectable, Logger, MessageEvent, NotFoundException } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './schema/notification.schema';
import { NotificationStatus } from '@pindder/contracts';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  
  // Central event bus for notifications
  private readonly notificationSubject$ = new Subject<Notification>();

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  /**
   * Called by any service in your app (OrderService, AuthService, etc.)
   * to publish a real-time notification to a specific user.
   */
  emitNotification(notification: Notification): void {
    this.logger.log(`Emitting notification: ${notification._id}`);
    this.notificationSubject$.next(notification);
  }

  /**
   * Filters the central stream so a connected user only receives
   * events intended for them.
   */
  getNotificationStream(userId: string): Observable<MessageEvent> {
    return this.notificationSubject$.asObservable().pipe(
      // 1. Filter notifications where the user is either client or tailor
      filter(
        (notification) =>
          notification.client?._id === userId ||
          notification.tailor?._id === userId ||
          notification.customer?._id === userId,
      ),
      // 2. Map to standard MessageEvent structure for SSE
      map((notification) => ({
        id: notification._id,
        type: notification.type || 'notification',
        // Everything the client needs goes inside the 'data' property
        data: {
          _id: notification._id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          action: notification.action,
          client: notification.client || null,
          tailor: notification.tailor || null,
          customer: notification.customer || null,
          payload: notification.data || null,
        },
      } as MessageEvent)),
    );
  }

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationModel.create(createNotificationDto);
    this.emitNotification(notification);
    return notification;
  }

  findAll() {
    return this.notificationModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) throw new NotFoundException(`Notification ${id} not found`);
    return notification;
  }

  async findAccountNotifications(acctId: string) {
    try {
      const notifications = await this.notificationModel.find({
        $or: [
          { 'client._id': acctId },
          { 'customer._id': acctId },
          { 'tailor._id': acctId }
        ]
      }).sort({ createdAt: -1 });

      if(!notifications) {
        return 
      }

      return notifications;
    } catch(error: any) {
      return error;
    }
  }

  async findAccountRecentNotifications(acctId: string) {
    try {
      const notifications = await this.notificationModel.find({
        $or: [
          { 'client._id': acctId },
          { 'customer._id': acctId },
          { 'tailor._id': acctId }
        ],
        $and: [
          { status: NotificationStatus.UNREAD },
        ]
      })
      .sort({ createdAt: -1 })
      .limit(10);

      if(!notifications) {
        return 
      }

      return notifications;
    } catch(error: any) {
      return error;
    }
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.notificationModel
      .findByIdAndUpdate(id, { $set: updateNotificationDto }, { new: true, runValidators: true })
      .exec();
    if (!notification) throw new NotFoundException(`Notification ${id} not found`);
    return notification;
  }

  async remove(id: string) {
    const notification = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!notification) throw new NotFoundException(`Notification ${id} not found`);
    return notification;
  }
}
