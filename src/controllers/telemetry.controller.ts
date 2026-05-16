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
      console.log("🔍 [TELEMETRY] Iniciando getAll()");
      const telemetrias = await Telemetria.findAll({ order: [["fecha_registro", "DESC"]], limit: 50 });
      console.log("📦 [TELEMETRY] Registros encontrados:", telemetrias.length);
      
      const normalizedTelemetrias = telemetrias.map((telemetria: any) => {
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
      });
      console.log("✅ [TELEMETRY] Normalización completada");

      return res.status(200).json({
        success: true,
        data: normalizedTelemetrias,
        telemetrias: normalizedTelemetrias,
      });
    } catch (error: any) {
      console.error("❌ [TELEMETRY] Error en getAll():", error.message, error.stack);
      return res.status(500).json({ 
        success: false, 
        message: "Error interno al obtener telemetría",
        error: error.message 
      });
    }
  }

  public async debug(req: Request, res: Response) {
    try {
      console.log("🔍 [DEBUG] Verificando conexión y tablas...");
      const [rows]: any = await (Telemetria.sequelize as any).query("SHOW TABLES");
      const tables = rows.map((r: any) => Object.values(r)[0]);
      console.log("📋 Tablas encontradas:", tables);

      const telemetriaCount = await Telemetria.count();
      console.log("📦 Registros en telemetria:", telemetriaCount);

      // Intentar obtener un registro para ver la estructura
      const sample = await Telemetria.findOne();
      console.log("📄 Muestra de registro:", sample);

      return res.status(200).json({
        success: true,
        tables,
        telemetriaCount,
        sample,
        message: "Debug info"
      });
    } catch (error: any) {
      console.error("❌ [DEBUG] Error:", error.message, error.stack);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  public async mockData(req: Request, res: Response) {
    try {
      console.log("🎭 [MOCK] Generando datos de prueba...");
      const mockTelemetria = [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          ldr: 450,
          batteryVoltage: 12.3,
          lamp: true,
          autoMode: true,
          manualStatus: false,
          panelId: 1,
          batteryId: 1,
          luminariaId: 1,
          energiaGenerada: 150.5
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 60000).toISOString(),
          ldr: 500,
          batteryVoltage: 12.5,
          lamp: false,
          autoMode: true,
          manualStatus: false,
          panelId: 1,
          batteryId: 1,
          luminariaId: 1,
          energiaGenerada: 155.0
        }
      ];
      return res.status(200).json({
        success: true,
        data: mockTelemetria,
        telemetrias: mockTelemetria,
        message: "Mock data - para pruebas"
      });
    } catch (error: any) {
      console.error("❌ [MOCK] Error:", error.message);
      return res.status(500).json({ success: false, error: error.message });
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

  private parseTimestamp(body: any): Date {
    const value = body.timestamp ?? body.fecha_registro ?? body.fecha ?? body.fecha_lectura ?? body.fecha_estado ?? body.createdAt;
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === "number") {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    if (typeof value === "string") {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    return new Date();
  }

  public async create(req: Request, res: Response) {
    try {
      const timestamp = this.parseTimestamp(req.body);
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
        fecha: timestamp,
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
        let device = await Device.findByPk(payloadPanelId);
        if (!device) {
          device = await Device.create({
            id: payloadPanelId,
            name: `Dispositivo IoT ${payloadPanelId}`,
            location: 'Desconocido',
            status: payloadLamp ? 'activo' : 'inactivo',
            mode: payloadAutoMode ? 'automatico' : 'manual',
          } as any);
          response.deviceCreated = device;
        } else {
          const updatedDevice = await device.update({
            status: payloadLamp ? 'activo' : 'inactivo',
            mode: payloadAutoMode ? 'automatico' : 'manual',
          });
          response.deviceUpdated = updatedDevice;
        }
      }

      if (payloadPanelId) {
        const sensor = await Sensor.findOne({ where: { id_dispositivo: payloadPanelId } });
        if (sensor) {
          response.sensorUpdated = sensor;
        } else {
          const createdSensor = await Sensor.create({
            tipo_sensor: 'Fotoresistor',
            descripcion: `Sensor de luminosidad del dispositivo ${payloadPanelId}`,
            id_dispositivo: payloadPanelId,
            unidad_medida: 'lux',
          });
          response.sensorCreated = createdSensor;
        }
      }

      if (payloadBatteryId) {
        let bateria = await Bateria.findByPk(payloadBatteryId);
        if (!bateria) {
          bateria = await Bateria.create({
            id_bateria: payloadBatteryId,
            capacidad_ah: 0,
            voltaje: payloadBatteryVoltage ?? 0,
            estado: payloadLamp ? 'activo' : 'inactivo',
            id_panel: payloadPanelId ?? null,
          } as any);
          response.batteryCreated = bateria;
        } else {
          const updatedBateria = await bateria.update({
            voltaje: payloadBatteryVoltage ?? bateria.voltaje,
            estado: payloadLamp ? 'activo' : 'inactivo',
          });

          response.batteryUpdated = updatedBateria;
        }

        await EstadoBateria.create({
          id_bateria: payloadBatteryId,
          nivel_carga: payloadBatteryVoltage ?? 0,
          fecha_estado: timestamp,
        });
      }

      if (payloadLuminariaId) {
        let luminaria = await Luminaria.findByPk(payloadLuminariaId);
        if (!luminaria) {
          luminaria = await Luminaria.create({
            id_luminaria: payloadLuminariaId,
            tipo_luminaria: 'Luminaria IoT',
            potencia_watts: 0,
            estado: payloadLamp ? 'activo' : 'inactivo',
            id_zona: 1,
          } as any);
          response.luminariaCreated = luminaria;
        } else {
          const updatedLuminaria = await luminaria.update({
            estado: payloadLamp ? 'activo' : 'inactivo',
          });
          response.luminariaUpdated = updatedLuminaria;
        }

        await EstadoLuminaria.create({
          id_luminaria: payloadLuminariaId,
          estado: payloadLamp ? 'activo' : 'inactivo',
          fecha_estado: timestamp,
        });
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
          fecha_registro: timestamp,
        });
      }

      if (payloadPanelId && payloadEnergiaGenerada != null) {
        const energia = await TelemetriaEnergia.create({
          id_panel: payloadPanelId,
          energia_generada: payloadEnergiaGenerada,
          fecha_registro: timestamp,
        });
        response.energiaCreated = energia;
      }

      if (telemetryRecord) {
        const raw = typeof telemetryRecord.toJSON === "function" ? telemetryRecord.toJSON() : telemetryRecord;
        response.telemetryRecord = {
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
      } else {
        response.telemetryRecord = null;
      }

      return res.status(201).json({ success: true, data: response });
    } catch (error) {
      console.error("Error saving telemetry data:", error);
      return res.status(500).json({ success: false, message: "Error interno al guardar telemetría" });
    }
  }
}
