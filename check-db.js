const mysql = require('mysql2/promise');

(async () => {
  try {
    console.log('📡 Conectando a base de datos...');
    const conn = await mysql.createConnection({
      host: 'shuttle.proxy.rlwy.net',
      port: 12437,
      user: 'root',
      password: 'HfZVfFrQtOlCADvfHwlUdlTOFOVlhsMJ',
      database: 'railway'
    });
    console.log('✅ Conectado');

    // Verificar tablas
    console.log('\n📋 Verificando tablas...');
    const [tables] = await conn.query('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = "railway" ORDER BY TABLE_NAME');
    const tableNames = tables.map(t => t.TABLE_NAME);
    console.log('Tablas:', tableNames);

    if (tableNames.includes('telemetria')) {
      console.log('\n✅ Tabla telemetria existe');
      
      const [count] = await conn.query('SELECT COUNT(*) as cnt FROM telemetria');
      console.log('Registros:', count[0].cnt);
      
      if (count[0].cnt > 0) {
        const [rows] = await conn.query('SELECT id_telemetria, id_panel, id_bateria, id_luminaria, ldr_value, battery_voltage, fecha_registro FROM telemetria ORDER BY fecha_registro DESC LIMIT 3');
        console.log('\n📦 Últimos registros:');
        console.table(rows);
      } else {
        console.log('⚠️ Tabla telemetria está vacía');
      }
    } else {
      console.log('\n❌ Tabla telemetria NO existe');
    }

    await conn.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();
