import { Application } from "express";

import { DeviceController } from '../controllers/devices.controller';
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAnyRole, requireOperator } from "../middleware/roleMiddleware";

export class DeviceRoutes {
    public deviceController: DeviceController =  new DeviceController();

    public routes(app: Application): void {
        app.route("/devices/test").get(this.deviceController.test)
        app.route("/devices").get(authMiddleware, requireAnyRole(['Monitor', 'Operador', 'Admin']), this.deviceController.getAll)
        app.route("/devices").post(authMiddleware, requireOperator, this.deviceController.create)
        app.route("/devices/:id").put(authMiddleware, requireOperator, this.deviceController.update)
        app.route("/devices/:id").delete(authMiddleware, requireOperator, this.deviceController.delete)
        app.route("/devices/:id").get(authMiddleware, requireAnyRole(['Monitor', 'Operador', 'Admin']), this.deviceController.getOne)
    }
}
