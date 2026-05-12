import { Application } from "express";
import { UsuarioRolController } from "../controllers/usuario_rol.controller";

export class UsuarioRolRoutes {
  private usuarioRolController = new UsuarioRolController();

  public routes(app: Application): void {
    app.route("/api/usuarios-roles").get(this.usuarioRolController.getAll.bind(this.usuarioRolController));
    app.route("/api/usuarios-roles/:id_usuario/:id_rol").get(this.usuarioRolController.getById.bind(this.usuarioRolController));
    app.route("/api/usuarios-roles").post(this.usuarioRolController.create.bind(this.usuarioRolController));
    app.route("/api/usuarios-roles/:id_usuario/:id_rol").delete(this.usuarioRolController.delete.bind(this.usuarioRolController));
  }
}