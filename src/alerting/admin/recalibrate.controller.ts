import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AlertingService } from '../alerting.service';

@Controller('admin/vehicles')
@UseGuards(JwtAuthGuard)
export class RecalibrateController {
  constructor(private readonly alertingService: AlertingService) {}

  @Post(':vehicleId/force-recalibrate')
  async forceRecalibrate(@Param('vehicleId') vehicleId: string) {
    const active = await this.alertingService.findActiveForVehicle(vehicleId);
    await Promise.all(active.map((a) => this.alertingService.resolve(a._id.toString())));
    return { vehicleId, recalibrated: true, clearedAlerts: active.length };
  }
}
