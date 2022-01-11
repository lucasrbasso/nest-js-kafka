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
    console.log(createCertificateDto);
    return certificate.save();
  }

  findAll() {
    return this.certificateModel.find();
  }

  findOne(id: string) {
    return this.certificateModel.findById(id);
  }

  update(id: string, updateCertificateDto: UpdateCertificateDto) {
    return this.certificateModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        updateCertificateDto,
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
