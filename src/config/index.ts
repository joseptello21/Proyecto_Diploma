import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan"
import { sequelize, testConnection, getDatabaseInfo, renameTableIfNeeded } from "../database/db"
import { Routes } from "../routers/index";
import { authMiddleware } from "../middleware/authMiddleware"
import { RoleInitializer } from "../utils/roleInitializer";
var cors = require("cors")

dotenv.config();

export class App {
  public routers: Routes = new Routes();

  public app: Application

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.dbConnection();
  }

  private settings(): void {
    this.app.set("port", this.port || process.env.PORT || 3001);
  }

  private middlewares(): void {
    this.app.get("/health", (_req, res) => res.json({ status: "ok" }));
    this.app.use(morgan("dev"));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    // Las rutas se configurarán más adelante
    this.routers.authRoutes.routes(this.app)
    this.routers.telemetryRoutes.routes(this.app)

    this.app.use(authMiddleware)


    this.routers.dispositivosRoutes.routes(this.app)
    this.routers.UsuarioRoutes.routes(this.app)
    this.routers.alertaRoutes.routes(this.app)
    this.routers.bateriaRoutes.routes(this.app)
    this.routers.estadoBateriaRoutes.routes(this.app)
    this.routers.estadoLuminariaRoutes.routes(this.app)
    this.routers.lecturaRoutes.routes(this.app)
    this.routers.luminarRoutes.routes(this.app)
    this.routers.sensorRoutes.routes(this.app)
    this.routers.comandoRoutes.routes(this.app)
    this.routers.zonaRoutes.routes(this.app)


  }

  private async dbConnection(): Promise<void> {
    try {
      // Mostrar información de la base de datos seleccionada
      const dbInfo = getDatabaseInfo();
      console.log(`🔗 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      // Probar la conexión
      const isConnected = await testConnection();

      if (!isConnected) {
        throw new Error(
          `No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`,
        );
      }

      // Renombrar tabla si es necesario
      await renameTableIfNeeded();

      // Sincronizar la base de datos
      await sequelize.sync({ force: false });
      console.log(`📦 Base de datos sincronizada exitosamente`);

      // Inicializar roles base
      await RoleInitializer.crearRolesBase();
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1); // Terminar la aplicación si no se puede conectar
    }
  }

  async listen() {
    await this.app.listen(this.app.get("port"));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get("port")}`);
  }
}
