import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertingController } from './alerting.controller';
import { AlertingService } from './alerting.service';
import { Alert, AlertSchema } from './schemas/alert.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Alert.name, schema: AlertSchema }])],
  controllers: [AlertingController],
  providers: [AlertingService],
  exports: [AlertingService],
})
export class AlertingModule {}
