import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AlertingService } from "./alerting.service";
import {InternalTokenGuard} from "../auth/internal-token.guard";


@Controller('internal/alerts')
@UseGuards(InternalTokenGuard)
export class AlertingController {
    constructor(private readonly alertingService: AlertingService) { }


    @Get(':vehicleId')
    findActive(@Param('vehicleId') vehicleId: string) {
        return this.alertingService.findActiveForVehicle(vehicleId);
    }

    @Patch(':alertId/resolve')
    resolve(@Param('alertId') alertId: string) {
        return this.alertingService.resolve(alertId);
    }
}

