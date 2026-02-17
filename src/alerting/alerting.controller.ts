import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AlertingService } from './alerting.service';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertingController {
  constructor(private readonly alertingService: AlertingService) {}

  @Get(':vehicleId')
  findActive(@Param('vehicleId') vehicleId: string) {
    return this.alertingService.findActiveForVehicle(vehicleId);
  }
}
