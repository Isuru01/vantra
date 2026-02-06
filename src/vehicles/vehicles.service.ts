import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>) {}

  findAll() {
    return this.vehicleModel.find().exec();
  }

  findByVehicleId(vehicleId: string) {
    return this.vehicleModel.findOne({ vehicleId }).exec();
  }

  create(vehicleId: string, fleetName: string) {
    return this.vehicleModel.create({ vehicleId, fleetName });
  }
}
