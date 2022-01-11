import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificatesModule } from './certificates/certificates.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/certificate'),
    CertificatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
