# Vantra Compass Slice

Vantra is a NestJS and TypeScript fleet telemetry backend backed by MongoDB. This repository contains my implementation of the focused Project Compass assessment slice.

## Branches

The branches are used for the following purposes:

```text
main                              baseline/latest stable branch
dev                               integration branch for ongoing changes
feature/extract-alerting-service  implementation branch for the Alerting extraction
```

The Alerting service work was developed on `feature/extract-alerting-service` and then merged into `dev`. `main` remains the stable reference branch.

## Completed work

### T1: Stack and build setup

The local build configuration now emits compiled files under `dist`, including `dist/main.js`. The Docker Compose startup configuration includes a MongoDB health check, and application services wait for MongoDB to become healthy.

The Compose setup now runs the main API and the standalone Alerting service as separate services.

### T2: Alert regression

Git history identified the alert behavior change in commit `3775723`. The change removed the `resolvedAt: null` filter from offline-alert debouncing. As a result, a recently resolved alert could suppress a legitimate new offline alert.

Active-alert filtering is restored. A recent unresolved alert suppresses a duplicate, while a resolved or expired alert does not. The tests also cover the intended behavior.

### T3: Sensor telemetry ingestion

The original ingestion endpoint accepted GPS data only. The endpoint now accepts optional sensor data:

* `batteryLevel`
* `engineDiagnostics.faultCodes`
* `engineDiagnostics.temperature`
* `engineDiagnostics.rpm`

DTO decorators provide request validation, a class-transformer transform normalizes percentage strings such as `"87%"` to `87`, and service-level validation enforces the battery range. New records use numeric battery values.

The existing seed data intentionally contains both string and numeric battery values. The schema remains compatible with both formats, and historical documents are not migrated.

### T4: Dashboard performance

The original `GET /dashboard/vehicle-statuses` endpoint made one telemetry query for every vehicle. With 2,000 vehicles, that creates an N+1 query pattern.

The per-vehicle queries were replaced with one aggregation that selects the latest telemetry document per `vehicleId`. An in-memory map combines those results with the full vehicle list. Vehicles without telemetry are still returned with `latest: null`.

The compound index used by the latest-per-vehicle query is:

```text
{ vehicleId: 1, recordedAt: -1 }
```

### T5: Current-status caching

An in-memory Nest cache is used for the frequently requested vehicle-status response. The cache uses the key below and a 60-second TTL:

```text
dashboard:vehicle-statuses
```

The cache is invalidated after successful telemetry ingestion and after a vehicle is created. This prevents the cached full-fleet response from hiding new telemetry or newly added vehicles.

The in-memory store is suitable for this assessment and keeps the implementation small. Redis would be more appropriate for multiple API instances or a cache shared between processes.

### T6: Standalone Alerting service

Alerting is extracted into a separate NestJS application under `alerting-service`. It runs on port `3001` and owns:

* alert persistence
* offline-alert evaluation
* scheduled offline sweeps
* vehicle-alert recalibration

The main API keeps the existing user-facing routes and JWT guard. It now calls the Alerting service over HTTP. The standalone service protects its internal routes with an internal bearer token.

The request flow is:

```text
Client
  -> Main API with user JWT
  -> Alerting service over HTTP with internal bearer token
  -> MongoDB
```

## Routes

The main API exposes:

```text
GET  /alerts/:vehicleId
POST /admin/vehicles/:vehicleId/force-recalibrate
```

The main API proxies to these internal Alerting routes:

```text
GET  /internal/alerts/:vehicleId
POST /internal/admin/vehicles/:vehicleId/force-recalibrate
```

Internal requests require:

```http
Authorization: Bearer <ALERTING_SERVICE_TOKEN>
```

The generated OpenAPI document is available at [alerting-service/docs/openapi.json](alerting-service/docs/openapi.json). When the Alerting service is running, Swagger UI is available at `http://localhost:3001/docs`.

## Running with Docker

Create a local `.env` from `.env.example` and set strong values for `JWT_SECRET` and `ALERTING_SERVICE_TOKEN`. The environment files are ignored by Git.

From the repository root:

```powershell
docker compose up --build
```

After MongoDB is healthy, seed the Docker MongoDB from another terminal:

```powershell
$env:MONGO_URI="mongodb://127.0.0.1:27017/vantra"
npm run seed
```

The services are available at:

```text
Main API:         http://localhost:3000
Alerting service: http://localhost:3001
MongoDB:          mongodb://127.0.0.1:27017/vantra
Swagger:          http://localhost:3001/docs
OpenAPI JSON:     http://localhost:3001/docs-json
```

## Running locally with Docker MongoDB

To run the Nest applications locally while keeping MongoDB in Docker:

```powershell
docker compose up -d mongo redis

# Main API, from the repository root
npm install
npm run start:dev

# Alerting service, from a second terminal
cd alerting-service
npm install
npm run start:dev
```

The local Alerting service reads `alerting-service/.env.local`. Its `ALERTING_SERVICE_TOKEN` must match the token used by the main API.

## Verification

From the repository root:

```powershell
npm run typecheck
npm test
```

For the standalone service:

```powershell
cd alerting-service
npm run build
npm test
```

## Deliberate limitations


* The cache is process local and disappears when the application restarts. A horizontally scaled deployment should use Redis or another shared cache.
* The main API and Alerting service share the `vantra` MongoDB database. Alerting has its own telemetry read model and owns alert writes. A future design could remove this coupling with events or a dedicated telemetry API.
* The internal bearer token is suitable for local service to service protection, but production should use managed service identity
* Temperature validation is limited to checking that the value is finite because the device units and safe operating range were not specified. Temperature is placed inside `engineDiagnostics` because the existing schema comment groups temperature with fault codes and RPM.
* Historical battery documents were not migrated. Existing records can contain either percentage strings or numeric values, while new ingestion normalizes percentage input to a number.
* An API gateway, distributed tracing, retry policy, and full deployment orchestration are outside this scope.

## Next steps for a larger implementation

The repository does not currently show a message pipeline, queue, or worker configuration for streaming telemetry between services. Before introducing one, the event and delivery requirements would need to be clarified. For example, the system would need decisions about whether telemetry should be processed synchronously or through a queue, how retries and duplicate events are handled, and whether alert evaluation should be triggered by events rather than by the scheduled sweep.

Other follow up work would include adding contract and integration tests for both services, measuring MongoDB execution statistics continuously, defining sensor units and operating ranges with the device team, versioning the Alerting API contract, and replacing the local bearer token with managed service identity.
