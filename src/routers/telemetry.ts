import { Request, Response, Application } from "express";
import { createTelemetry, getAllTelemetry } from "../controllers/telemetry.controller";

export class TelemetryRoutes {

    public routes(app: Application): void {

        app.route("/api/solar/telemetry").post(createTelemetry);
        app.route("/api/solar/telemetry").get(getAllTelemetry);

    }

}