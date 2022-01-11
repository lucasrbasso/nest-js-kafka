import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';

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

  async getHello() {
    await this.kafkaProducer.send({
      topic: 'create-certificate',
      messages: [
        {
          key: Math.random() + '',
          value: JSON.stringify({
            userId: '121',
            name: 'Lucas',
            grade: '10',
            courseName: 'Kafka',
            courseId: '123',
          }),
        },
      ],
    });
  }

  async getCertificate() {
    this.client
      .send(
        'find-certificate',
        JSON.stringify({ id: '61dcd3e4d73810d641ca46af' }),
      )
      .subscribe((reply) => console.log(reply));
  }
}
