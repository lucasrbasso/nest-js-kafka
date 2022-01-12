import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop()
  userId: string;

  @Prop()
  message: string;

  @Prop()
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
