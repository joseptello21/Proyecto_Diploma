import { User } from "../models/User";
import { Rol } from "../models/rol";
import { UsuarioRol } from "../models/usuario_rol";

export class UserRoleInitializer {
  static async asignarRolesAUsuarios(): Promise<void> {
    try {
      // Buscar usuarios que no tengan roles asignados
      const usuarios = await User.findAll();

      for (const usuario of usuarios) {
        // Verificar si el usuario ya tiene roles
        const usuarioRol = await UsuarioRol.findAll({
          where: { id_usuario: usuario.id_usuario }
        });

        if (usuarioRol.length === 0) {
          // El usuario no tiene roles, asignarle un rol por defecto
          let rol;
          
          if (usuario.nombre === 'admin' || usuario.nombre === 'administrador') {
            // Admin y administrador obtienen el rol Admin
            rol = await Rol.findOne({ where: { nombre_rol: 'Admin' } });
          } else {
            // Otros usuarios obtienen el rol Monitor por defecto
            rol = await Rol.findOne({ where: { nombre_rol: 'Monitor' } });
          }

          if (rol) {
            await UsuarioRol.create({
              id_usuario: usuario.id_usuario,
              id_rol: rol.id_rol
            });

            console.log(`✅ Rol asignado a usuario "${usuario.nombre}": ${rol.nombre_rol}`);
          }
        } else {
          console.log(`ℹ️ Usuario "${usuario.nombre}" ya tiene roles asignados`);
        }
      }
    } catch (error) {
      console.error("❌ Error asignando roles a usuarios:", error);
    }
  }
}
