import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TelemetryEventDocument = TelemetryEvent & Document;

@Schema({ timestamps: { createdAt: 'receivedAt', updatedAt: false } })
export class TelemetryEvent {
  @Prop({ required: true, index: true })
  vehicleId: string;

  @Prop({ required: true })
  recordedAt: Date;

  // Populated by the { timestamps: { createdAt: 'receivedAt' } } option
  // above - declared explicitly here so it's typed on the class.
  receivedAt?: Date;

  @Prop({ type: { lat: Number, lng: Number }, required: true })
  location: { lat: number; lng: number };

  // Historical records may contain percentage strings, while new ingestion
  // stores normalized numeric values. Existing records are not migrated.
  @Prop({ type: Object, required: false })
  batteryLevel?: string | number;

  // Optional diagnostics are grouped so the telemetry contract can evolve
  // without adding a top-level field for every device metric.
  @Prop({ type: Object, required: false })
  engineDiagnostics?: Record<string, unknown>;
}

export const TelemetryEventSchema = SchemaFactory.createForClass(TelemetryEvent);

TelemetryEventSchema.index({ vehicleId: 1, recordedAt: -1 });
