import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export class RolRecurso extends Model {
    id_rol!: number;
    id_recurso!: number;
}

export interface RolRecursoI {
  id_rol?: number;
  id_recurso?: number;
}

RolRecurso.init(
  {
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_recurso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "rol_recurso",
    sequelize,
    timestamps: false,
  }
);