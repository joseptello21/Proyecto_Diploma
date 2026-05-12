import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class Recurso extends Model {
    id_recurso!: number;
    nombre_recurso!: string;
    descripcion!: string;
    estado!: string;
}

export interface RecursoI {
  id_recurso?: number;
  nombre_recurso: string;
  descripcion?: string;
  estado?: string;
}

Recurso.init(
  {
    id_recurso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_recurso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
      defaultValue: 'ACTIVO',
    },
  },
  {
    tableName: "recurso",
    sequelize,
    timestamps: false,
  }
);