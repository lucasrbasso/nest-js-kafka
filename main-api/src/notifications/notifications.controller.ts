import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Response } from 'express';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('/:user_id')
  async getNotifications(
    @Param('user_id') user_id: string,
    @Res() res: Response,
  ) {
    try {
      const notifications = await this.notificationsService.getNotifications(
        user_id,
      );
      res.status(HttpStatus.OK).json(notifications);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err });
    }
  }

  @Get('/read/:id')
  async readNotification(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.notificationsService.markNotificationAsRead(id);
      res.status(HttpStatus.OK).send();
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).send({ error: err });
    }
  }
}
