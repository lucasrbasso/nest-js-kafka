import { Injectable } from '@nestjs/common';
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
  constructor(
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
  ) {}

  create(createCertificateDto: CreateCertificateDto) {
    const certificate = new this.certificateModel(createCertificateDto);
    return certificate.save();
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

    return this.certificateModel.findByIdAndUpdate(
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
  }

  remove(id: string) {
    return this.certificateModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }
}
