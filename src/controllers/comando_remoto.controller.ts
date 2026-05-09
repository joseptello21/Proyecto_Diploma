import { Request, Response } from "express";
import { ComandoRemoto } from "../models/comando_remoto";

export class ComandoController {

    public async enviarComando(req: Request, res: Response) {
        const comando = await ComandoRemoto.create(req.body);
        res.json(comando);
    }

    public async getComandos(req: Request, res: Response) {
        const comandos = await ComandoRemoto.findAll();
        res.json(comandos);
    }

    public async sendDeviceCommand(req: Request, res: Response) {
        try {
            const { deviceId, command, parameters } = req.body;

            if (!deviceId || !command) {
                return res.status(400).json({
                    success: false,
                    message: "deviceId y command son requeridos"
                });
            }

            // Crear registro del comando
            const comandoRemoto = await ComandoRemoto.create({
                id_dispositivo: deviceId,
                comando: JSON.stringify({ command, parameters, timestamp: new Date() }),
                fecha_envio: new Date()
            });

            // Aquí iría la lógica real para enviar el comando al ESP32 vía MQTT
            // Por ahora simulamos el envío y registramos el comando
            console.log(`📡 Enviando comando '${command}' al dispositivo ${deviceId}:`, parameters);

            const mqttMessage = JSON.stringify({
                command,
                parameters,
                deviceId,
                timestamp: new Date().toISOString()
            });

            console.log(`📡 MQTT Message preparado: ${mqttMessage}`);

            const response = {
                success: true,
                deviceId,
                command,
                parameters,
                timestamp: new Date(),
                status: "sent_to_mqtt",
                mqttMessage
            };

            return res.status(200).json({
                success: true,
                message: "Comando enviado exitosamente al dispositivo",
                data: response,
                comandoId: comandoRemoto.id_comando
            });

        } catch (error: any) {
            console.error("❌ Error enviando comando:", error);
            return res.status(500).json({
                success: false,
                message: "Error interno del servidor",
                error: error.message
            });
        }
    }
}
