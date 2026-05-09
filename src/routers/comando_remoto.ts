import { Request, Response, Application } from "express";
import { ComandoController } from "../controllers/comando_remoto.controller";

export class ComandoRoutes {

    public comandoController: ComandoController = new ComandoController();

    public routes(app: Application): void {


        app.route("/comandos").get(this.comandoController.enviarComando);

        app.route("/comando").post(this.comandoController.getComandos);

        // Nuevo endpoint para enviar comandos a dispositivos ESP32
        app.route("/api/device/command").post(this.comandoController.sendDeviceCommand);

    }
}