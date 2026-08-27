import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehiclesService } from '../vehicles/vehicles.service';
import { TelemetryEvent, TelemetryEventDocument } from '../ingestion/schemas/telemetry-event.schema';

@Injectable()
export class DashboardService {
  constructor(
    private readonly vehiclesService: VehiclesService,
    @InjectModel(TelemetryEvent.name) private telemetryModel: Model<TelemetryEventDocument>,
  ) { }

  async getFleetOverview() {
    return this.vehiclesService.findAll();
  }

  /**
   * Returns the latest known telemetry reading for every vehicle in the fleet.
   * This is the most frequently hit read on the dashboard.
   */
  async getVehicleStatuses() {
    const vehicles = await this.vehiclesService.findAll();
    // const statuses: { vehicle: unknown; latest: unknown }[] = [];
    // for (const vehicle of vehicles) {
    //   // One query per vehicle - fine for a handful of vehicles in dev,
    //   // but this is the hot path so keep an eye on it as fleet size grows.
    //   const latest = await this.telemetryModel
    //     .findOne({ vehicleId: vehicle.vehicleId })
    //     .sort({ recordedAt: -1 })
    //     .exec();
    //   statuses.push({ vehicle, latest });
    // }


    // T4. Use aggregation to get the latest telemetry for all vehicles in one query. And fix N+1 query problem. Aggreagations starts from the Vehicle Models 
    // since the assuming all vehicles are required status even there is no telementry for theme

    const latestTelemetry = await this.telemetryModel.aggregate([
      { $sort: { recordedAt: -1, vehicleId: 1 } },
      {
        $group: {
          _id: '$vehicleId',
          latest: { $first: '$$ROOT' },
        },
      },
    ]);

    const latestByVehicle = new Map(
      latestTelemetry.map(({ _id, latest }) => [_id, latest]),
    );

    const statuses = vehicles.map((vehicle) => ({
      vehicle,
      latest: latestByVehicle.get(vehicle.vehicleId) || null,
    }));

    return statuses;
  }
}
