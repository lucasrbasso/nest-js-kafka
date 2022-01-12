import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  create(createNotificationDto: CreateNotificationDto) {
    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  async findByUserId(id: string) {
    const notifications = await this.notificationModel
      .find({ userId: id })
      .exec();

    return notifications;
  }

  async findByIdAndUpdate(id: string) {
    const updatedNotification = await this.notificationModel.findById(id);

    const updateObject = {
      userId: updatedNotification.userId,
      read: true,
      message: updatedNotification.message,
    };

    return this.notificationModel.findByIdAndUpdate(
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
  }
}
