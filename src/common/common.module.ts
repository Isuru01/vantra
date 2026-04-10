import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelemetryEvent, TelemetryEventSchema } from '../ingestion/schemas/telemetry-event.schema';
import { DriftCorrectionJob } from './jobs/drift-correction.job';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TelemetryEvent.name, schema: TelemetryEventSchema }]),
  ],
  providers: [DriftCorrectionJob],
})
export class CommonModule {}
