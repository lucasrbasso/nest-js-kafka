import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { response, Response } from 'express';
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
      res.status(HttpStatus.OK).json({ response });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err });
    }
  }

  @Get('/certificate/:id')
  async getCertificate(@Param() id: string, @Res() res: Response) {
    try {
      const certificate = await this.appService.getCertificate(id);
      res.status(HttpStatus.OK).json(certificate);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: err });
    }
  }

  // Users
}
