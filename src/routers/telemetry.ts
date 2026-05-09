import { Application } from "express";
import { TelemetryController } from "../controllers/telemetry.controller";

export class TelemetryRoutes {

    public telemetryController: TelemetryController = new TelemetryController();

    public routes(app: Application): void {

        app.route("/api/solar/telemetry").post(this.telemetryController.create);
        app.route("/api/solar/telemetry").get(this.telemetryController.getAll);
        app.route("/api/solar/telemetry/debug").get(this.telemetryController.debug);
        app.route("/api/solar/telemetry/mock").get(this.telemetryController.mockData);

    }

}