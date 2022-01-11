import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Injectable()
export class AppService {
  private kafkaProducer: Producer;

  constructor(
    @Inject('KAFKA_SERVICE')
    private clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf('find-certificate');
    await this.clientKafka.connect();
    this.kafkaProducer = await this.clientKafka.connect();
  }

  async createCertificate(createCertificateDto: CreateCertificateDto) {
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

  async getCertificate(id: string) {
    const response = new Promise((resolve) => {
      this.clientKafka.send('find-certificate', { id }).subscribe((reply) => {
        resolve(reply);
      });
    });

    return response;
  }

  async updateCertificate(id: string, updateCertificate: CreateCertificateDto) {
    await this.kafkaProducer.send({
      topic: 'update-certificate',
      messages: [
        {
          key: Math.random() + '',
          value: JSON.stringify({
            id,
            userId: updateCertificate.userId,
            name: updateCertificate.name,
            grade: updateCertificate.grade,
            courseName: updateCertificate.courseName,
            courseId: updateCertificate.courseId,
          }),
        },
      ],
    });

    return 'A alteração do seu certificado foi solicitada! Quando disponível, você receberá uma notificação!';
  }

  async deleteCertificate(id: string) {
    await this.kafkaProducer.send({
      topic: 'remove-certificate',
      messages: [
        {
          key: Math.random() + '',
          value: JSON.stringify({
            id,
          }),
        },
      ],
    });

    return 'A remoção do seu certificado foi solicitada!';
  }
}
