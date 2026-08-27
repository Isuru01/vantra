import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TelemetryEvent, TelemetryEventDocument } from './schemas/telemetry-event.schema';
import { IngestTelemetryDto } from './dto/ingest-telemetry.dto';
import { isNotFuture, isPlausibleCoordinate, isBatteryLevelValid, isValidTemperature } from './ingestion.validators';
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'


@Injectable()
export class IngestionService {
  constructor(
    @InjectModel(TelemetryEvent.name) private telemetryModel: Model<TelemetryEventDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async ingest(dto: IngestTelemetryDto) {
    if (!isPlausibleCoordinate(dto.lat, dto.lng)) {
      throw new BadRequestException('Coordinates out of range');
    }
    if (!isNotFuture(dto.recordedAt)) {
      throw new BadRequestException('recordedAt cannot be in the future');
    }

    // T3. For new battery level check battery range
    if (!isBatteryLevelValid(dto.batteryLevel)) {
      throw new BadRequestException('Battery level must be between 0 and 100');
    }

    if (!isValidTemperature(dto.engineDiagnostics?.temperature)) {
      throw new BadRequestException('Temperature must be a finite number');
    }

    const event = await this.telemetryModel.create({
      vehicleId: dto.vehicleId,
      recordedAt: new Date(dto.recordedAt),
      location: { lat: dto.lat, lng: dto.lng },
      batteryLevel: dto.batteryLevel,
      engineDiagnostics: dto.engineDiagnostics,
    });


    // invalidate the cache for vehicle statuses since new telemetry has been ingested
    await this.cacheManager.del("dashboard:vehicle-statuses"); 

    return event;
  }
}
