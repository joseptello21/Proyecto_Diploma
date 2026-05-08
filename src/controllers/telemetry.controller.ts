import { Request, Response } from "express";
import { Datos } from "../models/datos_sensor";
import { Bateria } from "../models/bateria";
import { Luminaria } from "../models/luminaria";
import { TelemetriaEnergia } from "../models/energia";
import { EstadoBateria } from "../models/estado_bateria";
import { EstadoLuminaria } from "../models/estado_luminaria";

export class TelemetryController {
  public async getAll(req: Request, res: Response) {
    try {
      const datos = await Datos.findAll({ order: [["fecha", "DESC"]], limit: 50 });
      const energias = await TelemetriaEnergia.findAll({ order: [["fecha_registro", "DESC"]], limit: 50 });

      return res.status(200).json({
        success: true,
        datos,
        energias,
      });
    } catch (error) {
      console.error("Error fetching telemetry data:", error);
      return res.status(500).json({ success: false, message: "Error interno al obtener telemetría" });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const {
        ldr,
        batteryVoltage,
        lamp,
        autoMode,
        manualStatus,
        panelId,
        batteryId,
        luminariaId,
        energiaGenerada,
      } = req.body;

      const sensorData = await Datos.create({
        nivel_luz: ldr ?? 0,
        fecha: new Date(),
        estado_luz: lamp ? "activo" : "inactivo",
      });

      const response: any = {
        sensorData,
        batteryUpdated: null,
        luminariaUpdated: null,
        energiaCreated: null,
      };

      if (batteryId) {
        const bateria = await Bateria.findByPk(batteryId);
        if (bateria) {
          const updatedBateria = await bateria.update({
            voltaje: batteryVoltage ?? bateria.voltaje,
            estado: lamp ? "activo" : "inactivo",
          });

          await EstadoBateria.create({
            id_bateria: batteryId,
            nivel_carga: batteryVoltage ?? 0,
            fecha_estado: new Date(),
          });

          response.batteryUpdated = updatedBateria;
        }
      }

      if (luminariaId) {
        const luminaria = await Luminaria.findByPk(luminariaId);
        if (luminaria) {
          const updatedLuminaria = await luminaria.update({
            estado: lamp ? "activo" : "inactivo",
          });

          await EstadoLuminaria.create({
            id_luminaria: luminariaId,
            estado: lamp ? "activo" : "inactivo",
            fecha_estado: new Date(),
          });

          response.luminariaUpdated = updatedLuminaria;
        }
      }

      if (panelId && energiaGenerada != null) {
        const energia = await TelemetriaEnergia.create({
          id_panel: panelId,
          energia_generada: energiaGenerada,
          fecha_registro: new Date(),
        });
        response.energiaCreated = energia;
      }

      return res.status(201).json({ success: true, data: response });
    } catch (error) {
      console.error("Error saving telemetry data:", error);
      return res.status(500).json({ success: false, message: "Error interno al guardar telemetría" });
    }
  }
}
