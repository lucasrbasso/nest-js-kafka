import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Producer } from 'kafkajs';

@Injectable()
export class NotificationsService {
  private kafkaProducer: Producer;

  constructor(
    @Inject('KAFKA_SERVICE')
    private clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf('find-notification-by-user');
    await this.clientKafka.connect();
    this.kafkaProducer = await this.clientKafka.connect();
  }

  async getNotifications(id: string) {
    const response = new Promise((resolve) => {
      this.clientKafka
        .send('find-notification-by-user', { id })
        .subscribe((reply) => {
          resolve(reply);
        });
    });

    return response;
  }

  async markNotificationAsRead(id: string) {
    await this.kafkaProducer.send({
      topic: 'read-notification',
      messages: [
        {
          key: Math.random() + '',
          value: JSON.stringify({
            id,
          }),
        },
      ],
    });
  }
}
