import { Injectable } from '@nestjs/common';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class DashboardService {
  constructor(private readonly vehiclesService: VehiclesService) {}

  async getFleetOverview() {
    return this.vehiclesService.findAll();
  }
}
