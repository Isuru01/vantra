# Vantra Alerting Service

Standalone NestJS service for alert retrieval, offline sweeps, and vehicle alert recalibration.

## Local setup

```powershell
npm install
$env:MONGO_URI="mongodb://127.0.0.1:27017/vantra"
$env:PORT="3001"
$env:ALERTING_SERVICE_TOKEN="your strong local token"
npm run start:dev
```

Swagger UI is available at `http://localhost:3001/docs`.
The OpenAPI document is available at `http://localhost:3001/docs-json`.

## Internal API

```text
GET  /internal/alerts/:vehicleId
POST /internal/admin/vehicles/:vehicleId/force-recalibrate
```

Both routes require the following header:

```http
Authorization: Bearer <ALERTING_SERVICE_TOKEN>
```

The main Vantra API exposes the user facing routes and forwards requests to this service. The service owns alert persistence, offline alert evaluation, scheduled sweeps, and vehicle alert recalibration.
