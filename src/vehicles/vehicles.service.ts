import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager'

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  findAll() {
    return this.vehicleModel.find().exec();
  }

  findByVehicleId(vehicleId: string) {
    return this.vehicleModel.findOne({ vehicleId }).exec();
  }

  create(vehicleId: string, fleetName: string) {
    const vehicle = this.vehicleModel.create({ vehicleId, fleetName });
    // T5:Invalidate the cache for vehicle statuses since a new vehicle has been added
    this.cacheManager.del("dashboard:vehicle-statuses");
    return vehicle;
  }
}
