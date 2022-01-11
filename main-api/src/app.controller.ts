import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Certificates

  @Post('/certificate')
  async createCertificate(
    @Body() createCertificateDto: CreateCertificateDto,
    @Res() res: Response,
  ) {
    try {
      const response = await this.appService.createCertificate(
        createCertificateDto,
      );
      res.status(HttpStatus.OK).json({ message: response });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err });
    }
  }

  @Get('/certificate/:id')
  async getCertificate(@Param('id') id: string, @Res() res: Response) {
    try {
      const certificate = await this.appService.getCertificate(id);
      res.status(HttpStatus.OK).json(certificate);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err });
    }
  }

  @Put('/certificate/:id')
  async updateCertificate(
    @Param('id') id: string,
    @Body() updateCertificateDto: CreateCertificateDto,
    @Res() res: Response,
  ) {
    try {
      const response = await this.appService.updateCertificate(
        id,
        updateCertificateDto,
      );
      res.status(HttpStatus.OK).json({ message: response });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err });
    }
  }

  @Delete('/certificate/:id')
  async deleteCertificate(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await this.appService.deleteCertificate(id);
      res.status(HttpStatus.OK).json({ message: response });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err });
    }
  }

  // Users
}
