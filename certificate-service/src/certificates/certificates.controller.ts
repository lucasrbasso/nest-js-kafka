import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

interface IdObjectProp {
  value: {
    id: string;
  };
}

@Controller()
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @MessagePattern('create-certificate')
  create(@Payload() createCertificateDto: { value: CreateCertificateDto }) {
    return this.certificatesService.create(createCertificateDto.value);
  }

  @MessagePattern('find-certificate')
  findOne(@Payload() idObject: IdObjectProp) {
    return this.certificatesService.findOne(idObject.value.id);
  }

  @MessagePattern('update-certificate')
  update(@Payload() updateCertificateDto: { value: UpdateCertificateDto }) {
    return this.certificatesService.update(
      updateCertificateDto.value.id,
      updateCertificateDto.value,
    );
  }

  @MessagePattern('remove-certificate')
  remove(@Payload() idObject: IdObjectProp) {
    return this.certificatesService.remove(idObject.value.id);
  }
}
