import { Controller, Param, Post, UseGuards } from '@nestjs/common';

import { AlertingService } from '../alerting.service';

@Controller('admin/vehicles')

export class RecalibrateController {
  constructor(private readonly alertingService: AlertingService) {}

  @Post(':vehicleId/force-recalibrate')
  async forceRecalibrate(@Param('vehicleId') vehicleId: string) {
   
  }
}
