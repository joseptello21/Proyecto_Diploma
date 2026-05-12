import { Request, Response } from "express";
import { UsuarioRol } from "../models/usuario_rol";

export class UsuarioRolController {

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const usuariosRoles = await UsuarioRol.findAll();
      res.json(usuariosRoles);
    } catch (error) {
      console.error("Error al obtener usuarios-roles:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = parseInt(String(req.params.id_usuario));
      const id_rol = parseInt(String(req.params.id_rol));
      const usuarioRol = await UsuarioRol.findOne({
        where: { id_usuario, id_rol }
      });

      if (!usuarioRol) {
        res.status(404).json({ message: "Relación usuario-rol no encontrada" });
        return;
      }

      res.json(usuarioRol);
    } catch (error) {
      console.error("Error al obtener usuario-rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { id_usuario, id_rol } = req.body;

      if (!id_usuario || !id_rol) {
        res.status(400).json({ message: "id_usuario e id_rol son requeridos" });
        return;
      }

      const usuarioRol = await UsuarioRol.create({ id_usuario, id_rol });
      res.status(201).json(usuarioRol);
    } catch (error) {
      console.error("Error al crear usuario-rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = parseInt(String(req.params.id_usuario));
      const id_rol = parseInt(String(req.params.id_rol));
      const usuarioRol = await UsuarioRol.findOne({
        where: { id_usuario, id_rol }
      });

      if (!usuarioRol) {
        res.status(404).json({ message: "Relación usuario-rol no encontrada" });
        return;
      }

      await usuarioRol.destroy();
      res.json({ message: "Relación usuario-rol eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar usuario-rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}