import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Certificate, CertificateSchema } from './entities/certificate.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
    ]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'my-consumer-' + Math.random(),
          },
        },
      },
    ]),
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
