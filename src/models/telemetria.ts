import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class Telemetria extends Model {
  public id_telemetria!: number;
  public ldr_value!: number;
  public battery_voltage!: number;
  public lamp_state!: boolean;
  public auto_mode!: boolean;
  public manual_status!: boolean;
  public id_panel!: number;
  public id_bateria!: number;
  public id_luminaria!: number;
  public energia_generada!: number | null;
  public fecha_registro!: Date;
}

export interface TelemetriaI {
  id_telemetria?: number;
  ldr_value: number;
  battery_voltage: number;
  lamp_state: boolean;
  auto_mode: boolean;
  manual_status: boolean;
  id_panel: number;
  id_bateria: number;
  id_luminaria: number;
  energia_generada?: number | null;
  fecha_registro?: Date;
}

Telemetria.init(
  {
    id_telemetria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ldr_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    battery_voltage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    lamp_state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    auto_mode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    manual_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    id_panel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_bateria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_luminaria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    energia_generada: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "telemetria",
    sequelize,
    timestamps: false,
  }
);
