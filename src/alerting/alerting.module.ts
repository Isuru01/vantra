import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertingController } from './alerting.controller';
import { AlertingService } from './alerting.service';
import { Alert, AlertSchema } from './schemas/alert.schema';
import { RecalibrateController } from './admin/recalibrate.controller';
import { TelemetryEvent, TelemetryEventSchema } from '../ingestion/schemas/telemetry-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Alert.name, schema: AlertSchema },
      { name: TelemetryEvent.name, schema: TelemetryEventSchema },
    ]),
  ],
  controllers: [AlertingController, RecalibrateController],
  providers: [AlertingService],
  exports: [AlertingService],
})
export class AlertingModule {}
