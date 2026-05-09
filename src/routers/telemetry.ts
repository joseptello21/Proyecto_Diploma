import { Application } from "express";
import { TelemetryController } from "../controllers/telemetry.controller";
import { requireAnyRole } from "../middleware/roleMiddleware";

export class TelemetryRoutes {

    public telemetryController: TelemetryController = new TelemetryController();

    public routes(app: Application): void {

        app.route("/api/solar/telemetry").post(this.telemetryController.create);
        app.route("/api/solar/telemetry").get(requireAnyRole(['Monitor', 'Operador', 'Admin']), this.telemetryController.getAll);
        app.route("/api/solar/telemetry/debug").get(requireAnyRole(['Monitor', 'Operador', 'Admin']), this.telemetryController.debug);
        app.route("/api/solar/telemetry/mock").get(requireAnyRole(['Monitor', 'Operador', 'Admin']), this.telemetryController.mockData);

    }

}