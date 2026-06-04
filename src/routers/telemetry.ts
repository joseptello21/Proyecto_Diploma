import { Application } from "express";
import { TelemetryController } from "../controllers/telemetry.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAnyRole } from "../middleware/roleMiddleware";

export class TelemetryRoutes {

    public telemetryController: TelemetryController = new TelemetryController();

    public routes(app: Application): void {

        // Endpoint público para simulador (sin autenticación)
        app.route("/api/solar/telemetry").post(this.telemetryController.create.bind(this.telemetryController));
        app.route("/api/solar/telemetry/public").post(this.telemetryController.create.bind(this.telemetryController));
        
        // Endpoints protegidos para usuarios autenticados
        app.route("/api/solar/telemetry").get(authMiddleware, requireAnyRole(['Monitor', 'Operador', 'Admin']), this.telemetryController.getAll.bind(this.telemetryController));
        app.route("/api/solar/telemetry/debug").get(authMiddleware, requireAnyRole(['Monitor', 'Operador', 'Admin']), this.telemetryController.debug.bind(this.telemetryController));
        app.route("/api/solar/telemetry/mock").get(authMiddleware, requireAnyRole(['Monitor', 'Operador', 'Admin']), this.telemetryController.mockData.bind(this.telemetryController));

    }

}