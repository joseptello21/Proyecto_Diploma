import { Request, Response } from "express";
import { Datos } from "../models/datos_sensor";
import { Bateria } from "../models/bateria";
import { Luminaria } from "../models/luminaria";
import { TelemetriaEnergia } from "../models/energia";
import { Telemetria } from "../models/telemetria";
import { EstadoBateria } from "../models/estado_bateria";
import { EstadoLuminaria } from "../models/estado_luminaria";
import { Device } from "../models/Device";
import { Sensor } from "../models/sensor";

export class TelemetryController {
  public async getAll(req: Request, res: Response) {
    try {
      const telemetrias = await Telemetria.findAll({ order: [["fecha_registro", "DESC"]], limit: 50 });
      const normalizedTelemetrias = telemetrias.map((telemetria: any) => this.normalizeTelemetry(telemetria));

      return res.status(200).json({
        success: true,
        data: normalizedTelemetrias,
        telemetrias: normalizedTelemetrias,
      });
    } catch (error) {
      console.error("Error fetching telemetry data:", error);
      return res.status(500).json({ success: false, message: "Error interno al obtener telemetría" });
    }
  }

  private normalizeTelemetry(telemetria: any) {
    if (!telemetria) {
      return null;
    }

    const raw = typeof telemetria.toJSON === "function" ? telemetria.toJSON() : telemetria;

    return {
      id: raw.id_telemetria ?? raw.id ?? null,
      timestamp: raw.fecha_registro ?? raw.timestamp ?? null,
      ldr: raw.ldr_value ?? raw.ldr ?? raw.ldrValue ?? null,
      batteryVoltage: raw.battery_voltage ?? raw.batteryVoltage ?? null,
      lamp: raw.lamp_state ?? raw.lamp ?? null,
      autoMode: raw.auto_mode ?? raw.autoMode ?? null,
      manualStatus: raw.manual_status ?? raw.manualStatus ?? null,
      panelId: raw.id_panel ?? raw.panelId ?? null,
      batteryId: raw.id_bateria ?? raw.batteryId ?? null,
      luminariaId: raw.id_luminaria ?? raw.luminariaId ?? null,
      energiaGenerada: raw.energia_generada ?? raw.energiaGenerada ?? null,
    };
  }

  public async create(req: Request, res: Response) {
    try {
      const {
        ldr,
        ldrValue,
        batteryVoltage,
        lamp,
        lampState,
        autoMode,
        auto_mode,
        manualStatus,
        manual_status,
        panelId,
        panel_id,
        batteryId,
        battery_id,
        luminariaId,
        luminaria_id,
        energiaGenerada,
        energia_generada,
      } = req.body;

      const payloadLdr = ldr ?? ldrValue ?? 0;
      const payloadLamp = typeof lamp !== "undefined"
        ? lamp
        : typeof lampState !== "undefined"
          ? lampState
          : false;
      const payloadBatteryVoltage = batteryVoltage ?? req.body.battery_voltage ?? req.body.voltage ?? 0;
      const payloadAutoMode = typeof autoMode !== "undefined"
        ? autoMode
        : typeof auto_mode !== "undefined"
          ? auto_mode
          : false;
      const payloadManualStatus = typeof manualStatus !== "undefined"
        ? manualStatus
        : typeof manual_status !== "undefined"
          ? manual_status
          : false;
      const payloadPanelId = panelId ?? panel_id ?? null;
      const payloadBatteryId = batteryId ?? battery_id ?? null;
      const payloadLuminariaId = luminariaId ?? luminaria_id ?? null;
      const payloadEnergiaGenerada = energiaGenerada ?? energia_generada ?? req.body.energyGenerated ?? req.body.energy ?? null;

      const sensorData = await Datos.create({
        nivel_luz: payloadLdr,
        fecha: new Date(),
        estado_luz: payloadLamp ? "activo" : "inactivo",
      });

      const response: any = {
        sensorData,
        batteryUpdated: null,
        luminariaUpdated: null,
        deviceUpdated: null,
        sensorUpdated: null,
        energiaCreated: null,
      };

      if (payloadPanelId) {
        const device = await Device.findByPk(payloadPanelId);
        if (device) {
          const updatedDevice = await device.update({
            status: payloadLamp ? "activo" : "inactivo",
            mode: payloadAutoMode ? "automatico" : "manual",
          });
          response.deviceUpdated = updatedDevice;
        }
      }

      if (payloadPanelId) {
        // Buscar sensor asociado al dispositivo y actualizar datos
        const sensor = await Sensor.findOne({ where: { id_dispositivo: payloadPanelId } });
        if (sensor) {
          // Los datos del sensor ya se crean en Datos, pero podemos actualizar el sensor si es necesario
          // Por ahora, solo registramos que se encontró
          response.sensorUpdated = sensor;
        }
      }

      if (payloadBatteryId) {
        const bateria = await Bateria.findByPk(payloadBatteryId);
        if (bateria) {
          const updatedBateria = await bateria.update({
            voltaje: payloadBatteryVoltage ?? bateria.voltaje,
            estado: payloadLamp ? "activo" : "inactivo",
          });

          await EstadoBateria.create({
            id_bateria: payloadBatteryId,
            nivel_carga: payloadBatteryVoltage ?? 0,
            fecha_estado: new Date(),
          });

          response.batteryUpdated = updatedBateria;
        }
      }

      if (payloadLuminariaId) {
        const luminaria = await Luminaria.findByPk(payloadLuminariaId);
        if (luminaria) {
          const updatedLuminaria = await luminaria.update({
            estado: payloadLamp ? "activo" : "inactivo",
          });

          await EstadoLuminaria.create({
            id_luminaria: payloadLuminariaId,
            estado: payloadLamp ? "activo" : "inactivo",
            fecha_estado: new Date(),
          });

          response.luminariaUpdated = updatedLuminaria;
        }
      }

      let telemetryRecord = null;
      const shouldCreateTelemetry = payloadPanelId || payloadBatteryId || payloadLuminariaId;

      if (shouldCreateTelemetry) {
        telemetryRecord = await Telemetria.create({
          ldr_value: payloadLdr,
          battery_voltage: payloadBatteryVoltage,
          lamp_state: payloadLamp,
          auto_mode: payloadAutoMode,
          manual_status: payloadManualStatus,
          id_panel: payloadPanelId,
          id_bateria: payloadBatteryId,
          id_luminaria: payloadLuminariaId,
          energia_generada: payloadEnergiaGenerada,
          fecha_registro: new Date(),
        });
      }

      if (payloadPanelId && payloadEnergiaGenerada != null) {
        const energia = await TelemetriaEnergia.create({
          id_panel: payloadPanelId,
          energia_generada: payloadEnergiaGenerada,
          fecha_registro: new Date(),
        });
        response.energiaCreated = energia;
      }

      response.telemetryRecord = telemetryRecord ? this.normalizeTelemetry(telemetryRecord) : null;

      return res.status(201).json({ success: true, data: response });
    } catch (error) {
      console.error("Error saving telemetry data:", error);
      return res.status(500).json({ success: false, message: "Error interno al guardar telemetría" });
    }
  }
}
