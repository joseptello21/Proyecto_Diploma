import { Request, Response } from "express";
import { RolRecurso } from "../models/rol_recurso";

export class RolRecursoController {

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const rolesRecursos = await RolRecurso.findAll();
      res.json(rolesRecursos);
    } catch (error) {
      console.error("Error al obtener roles-recursos:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const id_rol = parseInt(String(req.params.id_rol));
      const id_recurso = parseInt(String(req.params.id_recurso));
      const rolRecurso = await RolRecurso.findOne({
        where: { id_rol, id_recurso }
      });

      if (!rolRecurso) {
        res.status(404).json({ message: "Relación rol-recurso no encontrada" });
        return;
      }

      res.json(rolRecurso);
    } catch (error) {
      console.error("Error al obtener rol-recurso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { id_rol, id_recurso } = req.body;

      if (!id_rol || !id_recurso) {
        res.status(400).json({ message: "id_rol e id_recurso son requeridos" });
        return;
      }

      const rolRecurso = await RolRecurso.create({ id_rol, id_recurso });
      res.status(201).json(rolRecurso);
    } catch (error) {
      console.error("Error al crear rol-recurso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id_rol = parseInt(String(req.params.id_rol));
      const id_recurso = parseInt(String(req.params.id_recurso));
      const rolRecurso = await RolRecurso.findOne({
        where: { id_rol, id_recurso }
      });

      if (!rolRecurso) {
        res.status(404).json({ message: "Relación rol-recurso no encontrada" });
        return;
      }

      await rolRecurso.destroy();
      res.json({ message: "Relación rol-recurso eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar rol-recurso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}