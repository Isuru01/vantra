import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';

const OFFLINE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

@Injectable()
export class AlertingService {
  constructor(@InjectModel(Alert.name) private alertModel: Model<AlertDocument>) {}

  async checkVehicleOffline(vehicleId: string, lastSeenAt: Date) {
    const staleFor = Date.now() - lastSeenAt.getTime();
    if (staleFor <= OFFLINE_THRESHOLD_MS) {
      return null;
    }
    return this.alertModel.create({
      vehicleId,
      type: 'vehicle-offline',
      message: `Vehicle ${vehicleId} has not reported telemetry in over 15 minutes`,
    });
  }

  findActiveForVehicle(vehicleId: string) {
    return this.alertModel.find({ vehicleId, resolvedAt: null }).exec();
  }
}
