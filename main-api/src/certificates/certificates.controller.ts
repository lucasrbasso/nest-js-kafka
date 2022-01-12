import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post('/')
  async createCertificate(
    @Body() createCertificateDto: CreateCertificateDto,
    @Res() res: Response,
  ) {
    try {
      const response = await this.certificatesService.createCertificate(
        createCertificateDto,
      );
      res.status(HttpStatus.OK).json({ message: response });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err });
    }
  }

  @Get('/:id')
  async getCertificate(@Param('id') id: string, @Res() res: Response) {
    try {
      const certificate = await this.certificatesService.getCertificate(id);
      res.status(HttpStatus.OK).json(certificate);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err });
    }
  }

  @Put('/:id')
  async updateCertificate(
    @Param('id') id: string,
    @Body() updateCertificateDto: CreateCertificateDto,
    @Res() res: Response,
  ) {
    try {
      const response = await this.certificatesService.updateCertificate(
        id,
        updateCertificateDto,
      );
      res.status(HttpStatus.OK).json({ message: response });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err });
    }
  }

  @Delete('/:id')
  async deleteCertificate(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await this.certificatesService.deleteCertificate(id);
      res.status(HttpStatus.OK).json({ message: response });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err });
    }
  }
}
