import { Controller, Get, Param } from "@nestjs/common";
import { AlertingService } from "./alerting.service";


@Controller('alerts')
export class AlertingController {
    constructor(private readonly alertingService: AlertingService) { }


    @Get(':vehicleId')
    findActive(@Param('vehicleId') vehicleId: string) {
        return this.alertingService.findActiveForVehicle(vehicleId);
    }
}

