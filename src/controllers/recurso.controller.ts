import { Request, Response } from "express";
import { Recurso } from "../models/recurso";

export class RecursoController {

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const recursos = await Recurso.findAll();
      res.json(recursos);
    } catch (error) {
      console.error("Error al obtener recursos:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id));
      const recurso = await Recurso.findByPk(id);

      if (!recurso) {
        res.status(404).json({ message: "Recurso no encontrado" });
        return;
      }

      res.json(recurso);
    } catch (error) {
      console.error("Error al obtener recurso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre_recurso, descripcion, estado } = req.body;

      if (!nombre_recurso) {
        res.status(400).json({ message: "El nombre del recurso es requerido" });
        return;
      }

      const recurso = await Recurso.create({
        nombre_recurso,
        descripcion,
        estado: estado || 'ACTIVO'
      });
      res.status(201).json(recurso);
    } catch (error) {
      console.error("Error al crear recurso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id));
      const { nombre_recurso, descripcion, estado } = req.body;

      const recurso = await Recurso.findByPk(id);

      if (!recurso) {
        res.status(404).json({ message: "Recurso no encontrado" });
        return;
      }

      await recurso.update({ nombre_recurso, descripcion, estado });
      res.json(recurso);
    } catch (error) {
      console.error("Error al actualizar recurso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id));
      const recurso = await Recurso.findByPk(id);

      if (!recurso) {
        res.status(404).json({ message: "Recurso no encontrado" });
        return;
      }

      await recurso.destroy();
      res.json({ message: "Recurso eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar recurso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}