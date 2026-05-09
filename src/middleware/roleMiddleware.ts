import { Request, Response, NextFunction } from "express";
import { UsuarioRol } from "../models/usuario_rol";
import { Rol } from "../models/rol";

// ============================================
// MIDDLEWARE DE PERMISOS POR ROLES
// ============================================
// Valida que el usuario tenga el rol requerido
// 
// ROLES DISPONIBLES:
// - Admin: Acceso total a todas las funcionalidades
// - Operador: Puede controlar dispositivos (enviar comandos, cambiar modos)
// - Monitor: Solo puede ver datos, sin control de dispositivos
// ============================================

interface UserPayload {
  idusuarios?: number;
  id?: number;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export const requireRole = (rolNombre: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user as UserPayload;

      if (!user || (!user.idusuarios && !user.id)) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado"
        });
      }

      const userId = user.idusuarios || user.id;

      // Buscar los roles del usuario
      const usuarioRoles = await UsuarioRol.findAll({
        where: { usuario: userId },
        include: [
          {
            association: "rolData",
            model: Rol,
            attributes: ["idrol", "nombre", "estado"],
            where: { estado: "ACTIVO" }
          }
        ]
      });

      // Extraer nombres de roles
      const rolesDelUsuario = usuarioRoles
        .map((ur: any) => ur.rolData?.nombre)
        .filter(Boolean) as string[];

      console.log(`🔐 Usuario ${userId} tiene roles:`, rolesDelUsuario);

      // Verificar si el usuario tiene el rol requerido
      const tienePermiso =
        rolesDelUsuario.includes(rolNombre) ||
        rolesDelUsuario.includes("Admin");

      if (!tienePermiso) {
        return res.status(403).json({
          success: false,
          message: `Acceso denegado. Se requiere rol "${rolNombre}". Roles actuales: ${rolesDelUsuario.join(", ") || "ninguno"}`
        });
      }

      // Pasar los roles al siguiente middleware
      (req as any).userRoles = rolesDelUsuario;
      next();
    } catch (error: any) {
      console.error("❌ Error en roleMiddleware:", error);
      return res.status(500).json({
        success: false,
        message: "Error validando permisos",
        error: error.message
      });
    }
  };
};

export const requireOperator = requireRole("Operador");
export const requireMonitor = requireRole("Monitor");
export const requireAdmin = requireRole("Admin");

// Middleware que permite múltiples roles
export const requireAnyRole = (rolesRequeridos: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user as UserPayload;

      if (!user || (!user.idusuarios && !user.id)) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado"
        });
      }

      const userId = user.idusuarios || user.id;

      // Buscar los roles del usuario
      const usuarioRoles = await UsuarioRol.findAll({
        where: { usuario: userId },
        include: [
          {
            association: "rolData",
            model: Rol,
            attributes: ["idrol", "nombre", "estado"],
            where: { estado: "ACTIVO" }
          }
        ]
      });

      // Extraer nombres de roles
      const rolesDelUsuario = usuarioRoles
        .map((ur: any) => ur.rolData?.nombre)
        .filter(Boolean) as string[];

      console.log(
        `🔐 Usuario ${userId} tiene roles:`,
        rolesDelUsuario,
        `, requeridos: ${rolesRequeridos.join(", ")}`
      );

      // Verificar si el usuario tiene al menos uno de los roles requeridos
      const tienePermiso = rolesDelUsuario.some(
        (rol) =>
          rolesRequeridos.includes(rol) ||
          rol === "Admin"
      );

      if (!tienePermiso) {
        return res.status(403).json({
          success: false,
          message: `Acceso denegado. Se requiere uno de estos roles: ${rolesRequeridos.join(", ")}. Roles actuales: ${rolesDelUsuario.join(", ") || "ninguno"}`
        });
      }

      // Pasar los roles al siguiente middleware
      (req as any).userRoles = rolesDelUsuario;
      next();
    } catch (error: any) {
      console.error("❌ Error en roleMiddleware:", error);
      return res.status(500).json({
        success: false,
        message: "Error validando permisos",
        error: error.message
      });
    }
  };
};
