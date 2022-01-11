import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Controller()
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @MessagePattern('create-certificate')
  create(@Payload() createCertificateDto: { value: CreateCertificateDto }) {
    return this.certificatesService.create(createCertificateDto.value);
  }

  @MessagePattern('find-certificate')
  findOne(@Payload() idObject: any) {
    console.log(idObject.value.id);
    return this.certificatesService.findOne(idObject.value.id);
  }

  @MessagePattern('update-certificate')
  update(@Payload() updateCertificateDto: UpdateCertificateDto) {
    return this.certificatesService.update(
      updateCertificateDto.id,
      updateCertificateDto,
    );
  }

  @MessagePattern('remove-certificate')
  remove(@Payload() id: string) {
    return this.certificatesService.remove(id);
  }
}
