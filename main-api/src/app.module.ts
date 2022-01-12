import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { CertificatesModule } from './certificates/certificates.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [NotificationsModule, CertificatesModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
