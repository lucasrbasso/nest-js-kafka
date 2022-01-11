import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema()
export class Certificate {
  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop()
  grade: string;

  @Prop()
  courseName: string;

  @Prop()
  courseId: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
