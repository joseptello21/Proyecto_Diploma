import { Sequelize, QueryTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
 host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_NAME || 'railway',
  dialect: 'mysql' as const,
};

console.log(`🔌 Conectando a MySQL: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Verificar tablas al inicio
export const renameTableIfNeeded = async () => {
  try {
    const tables = await sequelize.query('SHOW TABLES', { type: QueryTypes.SELECT });
    const tableNames = tables.map((t: any) => Object.values(t)[0]);
    console.log('📋 Tablas en DB:', tableNames);
    
    // Verificar si existe la tabla usuario
    const usuarioExists = tableNames.includes('usuario');
    const usuariosExists = tableNames.includes('usuarios');
    
    if (usuarioExists && !usuariosExists) {
      // Renombrar usuario a usuarios
      console.log('🔄 Renombrando tabla usuario -> usuarios');
      await sequelize.query('RENAME TABLE usuario TO usuarios');
      console.log('✅ Tabla renombrada exitosamente');
    } else if (!usuarioExists && !usuariosExists) {
      console.log('⚠️ No existe tabla usuario ni usuarios - se creará automáticamente');
    } else if (usuariosExists) {
      console.log('✅ Tabla usuarios lista');
    }
  } catch (error: any) {
    // Si el error es porque no existe la tabla, no es problema
    if (error.code !== 'ER_NO_SUCH_TABLE') {
      console.error('⚠️ Error al verificar tablas:', error.message);
    }
  }
};

export const getDatabaseInfo = () => ({
  engine: 'mysql',
  config: dbConfig,
  connectionString: `mysql://${dbConfig.username}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`,
});

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a MYSQL');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a MYSQL:', error);
    return false;
  }
};

// Exportar database como alias para compatibilidad
export const database = sequelize;