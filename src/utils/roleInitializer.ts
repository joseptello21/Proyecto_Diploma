import { Rol } from "../models/rol";

export class RoleInitializer {
  static async crearRolesBase(): Promise<void> {
    try {
      const rolesBase = [
        {
          nombre: 'Operador',
          descripcion: 'Rol para operar y controlar los dispositivos. Acceso a control manual de lámparas, cambio de modo automático/manual, y envío de comandos.',
          estado: 'ACTIVO'
        },
        {
          nombre: 'Monitor',
          descripcion: 'Rol para monitorear datos en tiempo real. Solo visualización de telemetría, datos de sensores, batería y luminarias. Sin permisos de control.',
          estado: 'ACTIVO'
        },
        {
          nombre: 'Admin',
          descripcion: 'Rol de administrador con acceso total al sistema.',
          estado: 'ACTIVO'
        }
      ];

      for (const rol of rolesBase) {
        const [rolExistente, creado] = await Rol.findOrCreate({
          where: { nombre: rol.nombre },
          defaults: rol
        });

        if (creado) {
          console.log(`✅ Rol "${rol.nombre}" creado exitosamente`);
        } else {
          console.log(`ℹ️ Rol "${rol.nombre}" ya existe`);
        }
      }
    } catch (error) {
      console.error("❌ Error creando roles base:", error);
    }
  }
}