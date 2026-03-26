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

  // Populated out-of-band by the partner battery-reporting integration for
  // now (sends percentage strings like "87%"). Full first-party ingestion
  // support is planned - see VANTRA-512.
  @Prop({ required: false })
  batteryLevel?: string;

  // Engine diagnostics (fault codes, temperature, RPM) are on the device
  // firmware roadmap but not yet sent by any fleet. Field reserved so the
  // schema doesn't need another migration once they start arriving.
  // Ingestion/validation for this is not yet implemented - VANTRA-538.
  @Prop({ type: Object, required: false })
  engineDiagnostics?: Record<string, unknown>;
}

export const TelemetryEventSchema = SchemaFactory.createForClass(TelemetryEvent);
