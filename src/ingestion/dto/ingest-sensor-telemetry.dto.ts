// TODO(VANTRA-538): sensor telemetry ingestion (battery, engine diagnostics)
// is not yet implemented end-to-end. GPS-only ingestion is live; this DTO
// is a placeholder for when device firmware starts sending sensor payloads.
//
// import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
//
// export class IngestSensorTelemetryDto {
//   @IsString()
//   vehicleId: string;
//
//   @IsOptional()
//   batteryLevel?: number;
//
//   @IsOptional()
//   @IsObject()
//   engineDiagnostics?: Record<string, unknown>;
// }
