import { Request, Response } from "express";
import { Rol } from "../models/rol";

export class RolController {

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const roles = await Rol.findAll();
      res.json(roles);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id));
      const rol = await Rol.findByPk(id);

      if (!rol) {
        res.status(404).json({ message: "Rol no encontrado" });
        return;
      }

      res.json(rol);
    } catch (error) {
      console.error("Error al obtener rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre_rol, descripcion, estado } = req.body;

      if (!nombre_rol) {
        res.status(400).json({ message: "El nombre del rol es requerido" });
        return;
      }

      const rol = await Rol.create({ nombre_rol, descripcion, estado });
      res.status(201).json(rol);
    } catch (error) {
      console.error("Error al crear rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id));
      const { nombre_rol, descripcion, estado } = req.body;

      const rol = await Rol.findByPk(id);

      if (!rol) {
        res.status(404).json({ message: "Rol no encontrado" });
        return;
      }

      await rol.update({ nombre_rol, descripcion, estado });
      res.json(rol);
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id));
      const rol = await Rol.findByPk(id);

      if (!rol) {
        res.status(404).json({ message: "Rol no encontrado" });
        return;
      }

      await rol.destroy();
      res.json({ message: "Rol eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}