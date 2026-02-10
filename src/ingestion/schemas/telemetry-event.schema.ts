import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TelemetryEventDocument = TelemetryEvent & Document;

@Schema({ timestamps: { createdAt: 'receivedAt', updatedAt: false } })
export class TelemetryEvent {
  @Prop({ required: true, index: true })
  vehicleId: string;

  @Prop({ required: true })
  recordedAt: Date;

  @Prop({ type: { lat: Number, lng: Number }, required: true })
  location: { lat: number; lng: number };
}

export const TelemetryEventSchema = SchemaFactory.createForClass(TelemetryEvent);
