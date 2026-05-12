// Rutas con arquitectura de capas
import { AuthRoutes } from '../routes/auth.routes';
import { UsuarioRoutes } from '../routes/usuario.routes';

// Rutas originales
import { SensorRoutes } from "./sensor";
import { LuminariaRoutes } from "./luminaria";
import { BateriaRoutes } from "./bateria";
import { AlertaRoutes } from "./alerta";
import { ComandoRoutes } from "./comando_remoto";
import { EstadoLuminariaRoutes } from "./estado_luminaria";
import { EstadoBateriaRoutes } from "./estado_bateria";
import { TelemetryRoutes } from "./telemetry";
import { LecturaRoutes } from "./lectura_sensor";
import { DeviceRoutes } from "./devices.routers";

// Nuevas rutas para roles y permisos
import { RolRoutes } from "./rol.routes";
import { RecursoRoutes } from "./recurso.routes";
import { UsuarioRolRoutes } from "./usuario_rol.routes";
import { RolRecursoRoutes } from "./rol_recurso.routes";

// Stub para zona
class zonaRoutes {
  routes(app: any): void { console.log('zonaRoutes not implemented'); }
}

export class Routes {
  // Nuevas rutas con arquitectura de capas
  public authRoutes: AuthRoutes = new AuthRoutes();
  public UsuarioRoutes = new UsuarioRoutes();

  // Rutas originales
  public sensorRoutes = new SensorRoutes();
  public luminarRoutes = new LuminariaRoutes();
  public bateriaRoutes = new BateriaRoutes();
  public alertaRoutes = new AlertaRoutes();
  public comandoRoutes = new ComandoRoutes();
  public estadoLuminariaRoutes = new EstadoLuminariaRoutes();
  public estadoBateriaRoutes = new EstadoBateriaRoutes();
  public telemetryRoutes = new TelemetryRoutes();
  public lecturaRoutes = new LecturaRoutes();
  public dispositivosRoutes = new DeviceRoutes();

  // Nuevas rutas para roles y permisos
  public rolRoutes = new RolRoutes();
  public recursoRoutes = new RecursoRoutes();
  public usuarioRolRoutes = new UsuarioRolRoutes();
  public rolRecursoRoutes = new RolRecursoRoutes();

  // Stubs
  public zonaRoutes = new zonaRoutes();
}