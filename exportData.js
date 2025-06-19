import { connectSQLite } from './db/sqlite.js';
import fs from 'fs';
import path from 'path';

async function exportData() {
  const db = await connectSQLite();
  
  console.log('📤 EXPORTANDO DATOS DE LA BASE DE DATOS\n');
  
  try {
    // Obtener todos los datos
    const deportes = await db.all('SELECT * FROM deportes');
    const canchas = await db.all('SELECT * FROM canchas');
    const horarios = await db.all('SELECT * FROM horarios');
    const reservas = await db.all('SELECT * FROM reservas');
    const bloqueos = await db.all('SELECT * FROM bloqueos');
    const pagos = await db.all('SELECT * FROM pagos');

    // Crear objeto con todos los datos
    const data = {
      exportado: new Date().toISOString(),
      estadisticas: {
        deportes: deportes.length,
        canchas: canchas.length,
        horarios: horarios.length,
        reservas: reservas.length,
        bloqueos: bloqueos.length,
        pagos: pagos.length
      },
      deportes: deportes,
      canchas: canchas,
      horarios: horarios,
      reservas: reservas,
      bloqueos: bloqueos,
      pagos: pagos
    };

    // Exportar a archivo JSON
    const exportPath = path.resolve('db', 'exported_data.json');
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));
    
    console.log('✅ Datos exportados exitosamente a:');
    console.log(`   ${exportPath}`);
    console.log('');
    console.log('📊 RESUMEN DE DATOS EXPORTADOS:');
    console.log(`   • Deportes: ${deportes.length}`);
    console.log(`   • Canchas: ${canchas.length}`);
    console.log(`   • Horarios: ${horarios.length}`);
    console.log(`   • Reservas: ${reservas.length}`);
    console.log(`   • Bloqueos: ${bloqueos.length}`);
    console.log(`   • Pagos: ${pagos.length}`);
    console.log('');
    console.log('💡 Puedes abrir el archivo exported_data.json para ver todos los datos en formato legible.');

  } catch (error) {
    console.error('❌ Error al exportar datos:', error);
  } finally {
    await db.close();
  }
}

exportData(); 