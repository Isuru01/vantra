import { Module } from '@nestjs/common';
import { AlertingService } from "./alerting.service"
import { AlertingController } from './alerting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert, AlertSchema } from './schemas/alert.schema';
import { RecalibrateController } from './admin/recalibrate.controller';
import {
    TelemetryEvent,
    TelemetryEventSchema,
} from './schemas/telemetry-event.schema';
import { InternalTokenGuard } from '../auth/internal-token.guard';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Alert.name, schema: AlertSchema },
            { name: TelemetryEvent.name, schema: TelemetryEventSchema },
        ]),
    ],
    controllers: [AlertingController, RecalibrateController],
    providers: [AlertingService, InternalTokenGuard],
    exports: [AlertingService],
})
export class AlertingModule {}