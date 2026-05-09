import { Request, Response, Application } from "express";
import { ComandoController } from "../controllers/comando_remoto.controller";
import { requireOperator } from "../middleware/roleMiddleware";

export class ComandoRoutes {

    public comandoController: ComandoController = new ComandoController();

    public routes(app: Application): void {


        app.route("/comandos").get(this.comandoController.enviarComando);

        app.route("/comando").post(this.comandoController.getComandos);

        // Nuevo endpoint para enviar comandos a dispositivos ESP32
        // Solo operadores pueden enviar comandos de control
        app.route("/api/device/command").post(requireOperator, this.comandoController.sendDeviceCommand);

    }
}