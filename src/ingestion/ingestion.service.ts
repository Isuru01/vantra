import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TelemetryEvent, TelemetryEventDocument } from './schemas/telemetry-event.schema';
import { IngestTelemetryDto } from './dto/ingest-telemetry.dto';

@Injectable()
export class IngestionService {
  constructor(
    @InjectModel(TelemetryEvent.name) private telemetryModel: Model<TelemetryEventDocument>,
  ) {}

  async ingest(dto: IngestTelemetryDto) {
    const event = await this.telemetryModel.create({
      vehicleId: dto.vehicleId,
      recordedAt: new Date(dto.recordedAt),
      location: { lat: dto.lat, lng: dto.lng },
    });
    return event;
  }
}
