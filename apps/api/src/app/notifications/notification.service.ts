import { Injectable, InternalServerErrorException, Logger, MessageEvent, NotFoundException } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './schema/notification.schema';
import { IResponse, NotificationStatus } from '@pindder/contracts';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  
  // Central event bus for notifications
  private readonly notificationSubject$ = new Subject<Notification>();
  private notificationStream: any;

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
          notification.initiator._id.toString() === userId ||
          notification.dependent?._id.toString() === userId
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
          initiator: notification.initiator,
          dependent: notification.dependent || null,
          payload: notification.data || null,
          read: notification.read,
          status: notification.status,
        },
      } as MessageEvent)),
    );
  }

  onModuleInit() {
    // Watch the notifications collection for inserts (new records)
    this.notificationStream = this.notificationModel.watch([], { fullDocument: 'default' });

    this.notificationStream.on('change', (change: any) => {
      // Check if a brand new document was inserted
      if (change.operationType === 'insert') {
        const newNotification = change.fullDocument;

        // Push it into our RxJS stream
        this.notificationSubject$.next(newNotification);
      }
    });

    this.notificationStream.on('error', (error: any) => {
      this.logger.error('Notification: MongoDB Change Stream error', error);
    });
  }

  async onModuleDestroy() {
    if (this.notificationStream) {
      await this.notificationStream.close();
    }
  }

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      // create the notification
      const notification = await this.notificationModel.create(createNotificationDto);

      if(!notification) {
        this.logger.debug('NOTIFICATION_SERVICE: Failed to create notification...');
        return;
      }

      // Retrieve the newly created notfication with populated fields
      const populated = await this.getPopulatedNotification(notification._id);

      if(!populated) {
        this.logger.debug('NOTIFICATION_SERVICE: Failed to retrieve the newly created notification...');
        return
      }

      // Emit the notification to the stream
      this.emitNotification(populated);

      return;
    } catch(error: unknown) {
      this.logger.error('NOTIFICATION_SERVICE:', error);
      return;
    }
  }

  async getPopulatedNotification(notificationId: string) {
    return this.notificationModel
      .findById(notificationId)
      .populate('initiator', 'fullname firstname lastname accountType email countryCode tel profileImg status') // Only pull necessary fields
      .populate('dependent', 'fullname firstname lastname accountType email countryCode tel profileImg status') // Only pull necessary fields
      .exec();
  }

  findAll() {
    return this.notificationModel
    .find()
    .populate('initiator', 'fullname firstname lastname accountType email countryCode tel profileImg status')
    .populate('dependent', 'fullname firstname lastname accountType email countryCode tel profileImg status')
    .limit(50)
    .sort({ createdAt: -1 })
    .exec();
  }

  async findOne(id: string) {
    try {
      const notification = await this.getPopulatedNotification(id);
      
      if (!notification) throw new NotFoundException(`Notification ${id} not found`);
        
      return notification;
    } catch(error: unknown) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAccountNotifications(acctId: string) {
    try {
      const [notifications, totalNotifications, totalRead] = await Promise.all([
        this.notificationModel.find({
          $or: [
            { initiator: acctId },
            { dependent: acctId }
          ]
        })
        .populate('initiator', 'fullname firstname lastname accountType email countryCode tel profileImg status')
        .populate('dependent', 'fullname firstname lastname accountType email countryCode tel profileImg status')
        .limit(20)
        .sort({ createdAt: -1 }),
        this.notificationModel.countDocuments({ 
          $or: [
            { initiator: acctId },
            { dependent: acctId }
          ] 
        }),
        this.notificationModel.countDocuments({
          $or: [
            { initiator: acctId },
            { dependent: acctId }
          ],
          $and: [
            { read: true }
          ]
        }),
      ]);

      if(!notifications) {
        return 
      }

      const res: IResponse<Notification[]> = {
        statusCode: 200,
        msg: '',
        data: notifications,
        meta: {
          total: totalNotifications,
          totalNotificationsUnread: totalNotifications - totalRead,
          totalNotificationsRead: totalRead
        }
      }
      return res;
    } catch(error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async findAccountRecentNotifications(acctId: string) {
    try {
      const notifications = await this.notificationModel.find({
        $or: [
          { initiator: acctId },
          { dependent: acctId }
        ],
        $and: [
          { status: NotificationStatus.UNREAD },
        ]
      })
      .populate('initiator', 'fullname firstname lastname accountType email countryCode tel profileImg status')
      .populate('dependent', 'fullname firstname lastname accountType email countryCode tel profileImg status') 
      .limit(20)
      .sort({ createdAt: -1 });

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
      .findByIdAndUpdate(id, { $set: {...updateNotificationDto, status: NotificationStatus.READ }}, { returnDocument: 'after', runValidators: true })
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
