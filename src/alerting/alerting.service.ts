import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';

const OFFLINE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes
// Widened from 15min -> 6h after ops reported repeated alert noise for
// flapping vehicles (VANTRA-441).
const DEBOUNCE_WINDOW_MS = 6 * 60 * 60 * 1000;

@Injectable()
export class AlertingService {
  constructor(@InjectModel(Alert.name) private alertModel: Model<AlertDocument>) {}

  async checkVehicleOffline(vehicleId: string, lastSeenAt: Date) {
    const staleFor = Date.now() - lastSeenAt.getTime();
    if (staleFor <= OFFLINE_THRESHOLD_MS) {
      return null;
    }

    // Suppress if this vehicle raised an offline alert recently, full stop -
    // resolved or not. Cuts down on repeat notifications for flapping vehicles.
    const recent = await this.alertModel
      .findOne({
        vehicleId,
        type: 'vehicle-offline',
        createdAt: { $gte: new Date(Date.now() - DEBOUNCE_WINDOW_MS) },
      })
      .exec();

    if (recent) {
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
