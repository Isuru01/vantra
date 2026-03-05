import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';

const OFFLINE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes
const DEBOUNCE_WINDOW_MS = 15 * 60 * 1000; // don't re-alert within 15 min of an active alert

@Injectable()
export class AlertingService {
  constructor(@InjectModel(Alert.name) private alertModel: Model<AlertDocument>) {}

  async checkVehicleOffline(vehicleId: string, lastSeenAt: Date) {
    const staleFor = Date.now() - lastSeenAt.getTime();
    if (staleFor <= OFFLINE_THRESHOLD_MS) {
      return null;
    }

    // Only suppress if there's already an *active* (unresolved) alert of this
    // type raised recently - once an alert is resolved, a fresh occurrence
    // should always raise a new one.
    const recentActive = await this.alertModel
      .findOne({
        vehicleId,
        type: 'vehicle-offline',
        resolvedAt: null,
        createdAt: { $gte: new Date(Date.now() - DEBOUNCE_WINDOW_MS) },
      })
      .exec();

    if (recentActive) {
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

  resolve(alertId: string) {
    return this.alertModel.findByIdAndUpdate(alertId, { resolvedAt: new Date() }).exec();
  }
}
