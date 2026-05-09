import { Rol } from "../models/rol";

export class RoleInitializer {
  static async crearRolesBase(): Promise<void> {
    try {
      const rolesBase = [
        {
          nombre_rol: 'Operador'
        },
        {
          nombre_rol: 'Monitor'
        },
        {
          nombre_rol: 'Admin'
        }
      ];

      for (const rol of rolesBase) {
        const [rolExistente, creado] = await Rol.findOrCreate({
          where: { nombre_rol: rol.nombre_rol },
          defaults: rol
        });

        if (creado) {
          console.log(`✅ Rol "${rol.nombre_rol}" creado exitosamente`);
        } else {
          console.log(`ℹ️ Rol "${rol.nombre_rol}" ya existe`);
        }
      }
    } catch (error) {
      console.error("❌ Error creando roles base:", error);
    }
  }
}