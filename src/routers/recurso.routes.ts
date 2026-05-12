import { Application } from "express";
import { RecursoController } from "../controllers/recurso.controller";

export class RecursoRoutes {
  private recursoController = new RecursoController();

  public routes(app: Application): void {
    app.route("/api/recursos").get(this.recursoController.getAll.bind(this.recursoController));
    app.route("/api/recursos/:id").get(this.recursoController.getById.bind(this.recursoController));
    app.route("/api/recursos").post(this.recursoController.create.bind(this.recursoController));
    app.route("/api/recursos/:id").put(this.recursoController.update.bind(this.recursoController));
    app.route("/api/recursos/:id").delete(this.recursoController.delete.bind(this.recursoController));
  }
}