import { Body, Controller, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestTelemetryDto } from './dto/ingest-telemetry.dto';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('telemetry')
  ingest(@Body() dto: IngestTelemetryDto) {
    return this.ingestionService.ingest(dto);
  }
}
