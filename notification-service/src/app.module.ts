import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/notifications'),
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
