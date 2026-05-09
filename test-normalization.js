const mysql = require('mysql2/promise');

// Simular la normalización que hace el controlador
function normalizeTelemetry(telemetria) {
  if (!telemetria) {
    return null;
  }

  return {
    id: telemetria.id_telemetria ?? telemetria.id ?? null,
    timestamp: telemetria.fecha_registro ?? telemetria.timestamp ?? null,
    ldr: telemetria.ldr_value ?? telemetria.ldr ?? telemetria.ldrValue ?? null,
    batteryVoltage: telemetria.battery_voltage ?? telemetria.batteryVoltage ?? null,
    lamp: telemetria.lamp_state ?? telemetria.lamp ?? null,
    autoMode: telemetria.auto_mode ?? telemetria.autoMode ?? null,
    manualStatus: telemetria.manual_status ?? telemetria.manualStatus ?? null,
    panelId: telemetria.id_panel ?? telemetria.panelId ?? null,
    batteryId: telemetria.id_bateria ?? telemetria.batteryId ?? null,
    luminariaId: telemetria.id_luminaria ?? telemetria.luminariaId ?? null,
    energiaGenerada: telemetria.energia_generada ?? telemetria.energiaGenerada ?? null,
  };
}

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

    // Obtener telemetrias igual que hace el controlador
    const [telemetrias] = await conn.query('SELECT * FROM telemetria ORDER BY fecha_registro DESC LIMIT 50');
    console.log(`📦 Registros obtenidos: ${telemetrias.length}`);
    
    // Normalizar igual que hace el controlador
    const normalized = telemetrias.map(tel => normalizeTelemetry(tel));
    console.log('\n✅ Datos normalizados correctamente');
    
    // Mostrar resultado final igual que la API
    const response = {
      success: true,
      data: normalized,
      telemetrias: normalized,
    };
    
    console.log('\n📤 Respuesta que devolvería la API:');
    console.log(JSON.stringify(response, null, 2).substring(0, 500) + '...');
    
    await conn.end();
  } catch (e) {
    console.error('❌ Error:', e.message, e.stack);
  }
})();
