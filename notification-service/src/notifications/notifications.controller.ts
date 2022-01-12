import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

interface IdObjectProp {
  value: {
    id: string;
  };
}

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern('create-notification')
  create(@Payload() createNotificationDto: { value: CreateNotificationDto }) {
    return this.notificationsService.create(createNotificationDto.value);
  }

  @MessagePattern('read-notification')
  findAll(@Payload() idObject: IdObjectProp) {
    return this.notificationsService.findByIdAndUpdate(idObject.value.id);
  }

  @MessagePattern('find-notification-by-user')
  findOne(@Payload() idObject: IdObjectProp) {
    return this.notificationsService.findByUserId(idObject.value.id);
  }
}
