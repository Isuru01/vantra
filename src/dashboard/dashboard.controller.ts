import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('fleet-overview')
  getFleetOverview() {
    return this.dashboardService.getFleetOverview();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('vehicle-statuses')
  getVehicleStatuses() {
    return this.dashboardService.getVehicleStatuses();
  }
}
