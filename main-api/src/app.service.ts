import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { resolve } from 'path/posix';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Injectable()
export class AppService {
  private kafkaProducer: Producer;

  constructor(
    @Inject('KAFKA_SERVICE')
    private clientKafka: ClientKafka,
  ) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'my-consumer-2', // Should be the same thing we give in consumer
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf('find-certificate');
    await this.client.connect();
    this.kafkaProducer = await this.clientKafka.connect();
  }

  async createCertificate(createCertificateDto: CreateCertificateDto) {
    console.log(createCertificateDto);

    await this.kafkaProducer.send({
      topic: 'create-certificate',
      messages: [
        {
          key: Math.random() + '',
          value: JSON.stringify({
            userId: createCertificateDto.userId,
            name: createCertificateDto.name,
            grade: createCertificateDto.grade,
            courseName: createCertificateDto.courseName,
            courseId: createCertificateDto.courseId,
          }),
        },
      ],
    });

    return 'A criação do seu certificado foi solicitada! Quando disponível, você receberá uma notificação!';
  }

  consoleLogSubscribe(reply: any) {
    console.log(reply);
  }

  async getCertificate(id: string) {
    const response = new Promise((resolve) => {
      this.client
        .send('find-certificate', JSON.stringify(id))
        .subscribe((reply) => {
          console.log(reply);
          resolve(reply);
        });
    });

    return response;
  }
}
