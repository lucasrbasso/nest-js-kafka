import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import {
  Certificate,
  CertificateDocument,
} from './entities/certificate.entity';

@Injectable()
export class CertificatesService {
  private kafkaProducer: Producer;

  constructor(
    @Inject('KAFKA_SERVICE')
    private clientKafka: ClientKafka,

    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
  ) {}

  async onModuleInit() {
    this.kafkaProducer = await this.clientKafka.connect();
  }

  async create(createCertificateDto: CreateCertificateDto) {
    try {
      const certificate = new this.certificateModel(createCertificateDto);
      const response = certificate.save();

      await this.kafkaProducer.send({
        topic: 'create-notification',
        messages: [
          {
            key: Math.random() + '',
            value: JSON.stringify({
              userId: createCertificateDto.userId,
              message: 'Certificado gerado com sucesso!',
              read: false,
            }),
          },
        ],
      });

      return response;
    } catch (err) {
      await this.kafkaProducer.send({
        topic: 'create-notification',
        messages: [
          {
            key: Math.random() + '',
            value: JSON.stringify({
              userId: createCertificateDto.userId,
              message: 'Ocorreu um erro ao gerar seu certificado!',
              read: false,
            }),
          },
        ],
      });
    }
  }

  async findOne(id: string) {
    const certificate = await this.certificateModel.findById(id);
    return {
      certificate,
    };
  }

  async update(id: string, updateCertificateDto: UpdateCertificateDto) {
    const updateObject = {
      userId: updateCertificateDto.userId,
      name: updateCertificateDto.name,
      grade: updateCertificateDto.grade,
      courseName: updateCertificateDto.courseName,
      courseId: updateCertificateDto.courseId,
    };

    try {
      const response = await this.certificateModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: updateObject,
        },
        {
          new: true,
        },
      );

      await this.kafkaProducer.send({
        topic: 'create-notification',
        messages: [
          {
            key: Math.random() + '',
            value: JSON.stringify({
              userId: updateCertificateDto.userId,
              message: 'Certificado atualizado com sucesso!',
              read: false,
            }),
          },
        ],
      });

      return response;
    } catch (error) {
      await this.kafkaProducer.send({
        topic: 'create-notification',
        messages: [
          {
            key: Math.random() + '',
            value: JSON.stringify({
              userId: updateCertificateDto.userId,
              message: 'Ocorreu um erro ao atualizar seu certificado!',
              read: false,
            }),
          },
        ],
      });
    }
  }

  remove(id: string) {
    return this.certificateModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }
}
