import { Application } from "express";
import { RolRecursoController } from "../controllers/rol_recurso.controller";

export class RolRecursoRoutes {
  private rolRecursoController = new RolRecursoController();

  public routes(app: Application): void {
    app.route("/api/roles-recursos").get(this.rolRecursoController.getAll.bind(this.rolRecursoController));
    app.route("/api/roles-recursos/:id_rol/:id_recurso").get(this.rolRecursoController.getById.bind(this.rolRecursoController));
    app.route("/api/roles-recursos").post(this.rolRecursoController.create.bind(this.rolRecursoController));
    app.route("/api/roles-recursos/:id_rol/:id_recurso").delete(this.rolRecursoController.delete.bind(this.rolRecursoController));
  }
}