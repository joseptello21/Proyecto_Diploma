import { Application } from "express";
import { RolController } from "../controllers/rol.controller";

export class RolRoutes {
  private rolController = new RolController();

  public routes(app: Application): void {
    app.route("/api/roles").get(this.rolController.getAll.bind(this.rolController));
    app.route("/api/roles/:id").get(this.rolController.getById.bind(this.rolController));
    app.route("/api/roles").post(this.rolController.create.bind(this.rolController));
    app.route("/api/roles/:id").put(this.rolController.update.bind(this.rolController));
    app.route("/api/roles/:id").delete(this.rolController.delete.bind(this.rolController));
  }
}