import { Module } from '@nestjs/common';
import { AlertingController } from './alerting.controller';
import { AlertingService } from './alerting.service';
import { RecalibrateController } from './admin/recalibrate.controller';

@Module({
  controllers: [AlertingController, RecalibrateController],
  providers: [AlertingService],
  exports: [AlertingService],
})
export class AlertingModule {}
