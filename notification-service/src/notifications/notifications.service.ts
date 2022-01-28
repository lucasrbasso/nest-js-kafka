import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  private kafkaProducer: Producer;

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,

    @Inject('KAFKA_SERVICE')
    private clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaProducer = await this.clientKafka.connect();
  }

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = new this.notificationModel(createNotificationDto);
    const finalNotification = await notification.save();

    try {
      await this.kafkaProducer.send({
        topic: 'create-notification-user',
        messages: [
          {
            key: Math.random() + '',
            value: JSON.stringify({
              id: createNotificationDto.userId,
            }),
          },
        ],
      });
    } catch (err) {
      console.log(err);
    }

    return finalNotification;
  }

  async findByUserId(id: string) {
    const notifications = await this.notificationModel
      .find({ userId: id })
      .exec();

    return notifications;
  }

  async findByIdAndUpdate(id: string) {
    const notification = await this.notificationModel.findById(id);

    const updateObject = {
      userId: notification.userId,
      read: true,
      message: notification.message,
    };

    const updatedNotification = await this.notificationModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateObject,
      },
      {
        new: true,
      },
    );

    try {
      await this.kafkaProducer.send({
        topic: 'read-notification-user',
        messages: [
          {
            key: Math.random() + '',
            value: JSON.stringify({
              id: updatedNotification.userId,
            }),
          },
        ],
      });
    } catch (err) {
      console.log(err);
    }

    return updatedNotification;
  }
}
