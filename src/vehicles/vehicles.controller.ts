import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':vehicleId')
  findOne(@Param('vehicleId') vehicleId: string) {
    return this.vehiclesService.findByVehicleId(vehicleId);
  }

  @Post()
  create(@Body('vehicleId') vehicleId: string, @Body('fleetName') fleetName: string) {
    return this.vehiclesService.create(vehicleId, fleetName);
  }
}
