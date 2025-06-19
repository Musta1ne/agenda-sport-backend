import { connectSQLite } from './db/sqlite.js';

async function checkDatabase() {
  const db = await connectSQLite();
  
  console.log('🔍 VERIFICACIÓN DETALLADA DE LA BASE DE DATOS\n');
  
  try {
    // Verificar si el archivo de base de datos existe y tiene datos
    console.log('📁 VERIFICANDO ARCHIVO DE BASE DE DATOS:');
    const fs = await import('fs');
    const path = await import('path');
    
    const dbPath = path.resolve('db', 'database.sqlite');
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      console.log(`  ✅ Archivo existe: ${dbPath}`);
      console.log(`  📏 Tamaño: ${stats.size} bytes`);
    } else {
      console.log(`  ❌ Archivo no existe: ${dbPath}`);
      return;
    }
    console.log('');

    // Verificar tablas
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📋 TABLAS ENCONTRADAS:');
    tables.forEach(table => console.log(`  - ${table.name}`));
    console.log('');

    // Verificar deportes con conteo
    const deportes = await db.all('SELECT * FROM deportes');
    console.log('⚽ DEPORTES:');
    console.log(`  Total registros: ${deportes.length}`);
    if (deportes.length === 0) {
      console.log('  ❌ No hay deportes registrados');
    } else {
      deportes.forEach(dep => console.log(`  ✅ ID: ${dep.id}, Nombre: "${dep.nombre}"`));
    }
    console.log('');

    // Verificar canchas con conteo
    const canchas = await db.all('SELECT * FROM canchas');
    console.log('🏟️ CANCHAS:');
    console.log(`  Total registros: ${canchas.length}`);
    if (canchas.length === 0) {
      console.log('  ❌ No hay canchas registradas');
    } else {
      canchas.forEach(cancha => {
        console.log(`  ✅ ID: ${cancha.id}`);
        console.log(`     Nombre: "${cancha.nombre}"`);
        console.log(`     Tipo: "${cancha.tipo}"`);
        console.log(`     Precio: $${cancha.precio}`);
        console.log(`     Estado: "${cancha.estado}"`);
        console.log(`     ID Deporte: ${cancha.id_deporte}`);
        console.log('');
      });
    }

    // Verificar horarios con conteo
    const horarios = await db.all('SELECT * FROM horarios');
    console.log('🕐 HORARIOS:');
    console.log(`  Total registros: ${horarios.length}`);
    if (horarios.length === 0) {
      console.log('  ❌ No hay horarios registrados');
    } else {
      // Agrupar por cancha
      const horariosPorCancha = {};
      horarios.forEach(h => {
        if (!horariosPorCancha[h.id_cancha]) {
          horariosPorCancha[h.id_cancha] = [];
        }
        horariosPorCancha[h.id_cancha].push(h);
      });
      
      Object.keys(horariosPorCancha).forEach(canchaId => {
        const cancha = canchas.find(c => c.id == canchaId);
        const nombreCancha = cancha ? cancha.nombre : `Cancha ${canchaId}`;
        console.log(`  📍 ${nombreCancha} (ID: ${canchaId}): ${horariosPorCancha[canchaId].length} horarios`);
        
        // Mostrar primeros 5 horarios
        const primerosHorarios = horariosPorCancha[canchaId].slice(0, 5);
        primerosHorarios.forEach(h => {
          console.log(`    - ID: ${h.id}, ${h.hora_inicio} a ${h.hora_fin} (${h.dia_semana}) - Activo: ${h.activo}`);
        });
        if (horariosPorCancha[canchaId].length > 5) {
          console.log(`    ... y ${horariosPorCancha[canchaId].length - 5} más`);
        }
        console.log('');
      });
    }

    // Verificar reservas con conteo
    const reservas = await db.all('SELECT * FROM reservas');
    console.log('📅 RESERVAS:');
    console.log(`  Total registros: ${reservas.length}`);
    if (reservas.length === 0) {
      console.log('  ❌ No hay reservas registradas');
    } else {
      reservas.forEach(r => {
        const cancha = canchas.find(c => c.id == r.id_cancha);
        const nombreCancha = cancha ? cancha.nombre : `Cancha ${r.id_cancha}`;
        console.log(`  📝 ID: ${r.id}`);
        console.log(`     Cancha: ${nombreCancha} (ID: ${r.id_cancha})`);
        console.log(`     Fecha: "${r.fecha}"`);
        console.log(`     Horario: ${r.hora_inicio} - ${r.hora_fin}`);
        console.log(`     Cliente: "${r.nombre_usuario}"`);
        console.log(`     Teléfono: "${r.telefono}"`);
        console.log(`     Estado: "${r.estado}"`);
        console.log('');
      });
    }

    // Verificar bloqueos con conteo
    const bloqueos = await db.all('SELECT * FROM bloqueos');
    console.log('🚫 BLOQUEOS:');
    console.log(`  Total registros: ${bloqueos.length}`);
    if (bloqueos.length === 0) {
      console.log('  ❌ No hay bloqueos registrados');
    } else {
      bloqueos.forEach(b => {
        const cancha = canchas.find(c => c.id == b.id_cancha);
        const nombreCancha = cancha ? cancha.nombre : `Cancha ${b.id_cancha}`;
        console.log(`  🚫 ID: ${b.id}, ${b.fecha} ${b.hora_inicio}-${b.hora_fin} en ${nombreCancha}: ${b.motivo || 'Sin motivo'}`);
      });
    }
    console.log('');

    // Verificar pagos con conteo
    const pagos = await db.all('SELECT * FROM pagos');
    console.log('💰 PAGOS:');
    console.log(`  Total registros: ${pagos.length}`);
    if (pagos.length === 0) {
      console.log('  ❌ No hay pagos registrados');
    } else {
      pagos.forEach(p => {
        console.log(`  💰 ID: ${p.id}, Reserva: ${p.id_reserva}, Monto: $${p.monto}, Método: ${p.metodo}`);
      });
    }
    console.log('');

    // Estadísticas finales
    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log(`  • Deportes: ${deportes.length}`);
    console.log(`  • Canchas: ${canchas.length}`);
    console.log(`  • Horarios: ${horarios.length}`);
    console.log(`  • Reservas: ${reservas.length}`);
    console.log(`  • Bloqueos: ${bloqueos.length}`);
    console.log(`  • Pagos: ${pagos.length}`);

    // Si no hay datos, sugerir ejecutar el seed
    if (deportes.length === 0 || canchas.length === 0 || horarios.length === 0) {
      console.log('\n⚠️  ADVERTENCIA: La base de datos parece estar vacía.');
      console.log('💡 SUGERENCIA: Ejecuta "node db/seedSqlite.js" para poblar la base de datos.');
    }

  } catch (error) {
    console.error('❌ Error al verificar la base de datos:', error);
  } finally {
    await db.close();
  }
}

checkDatabase(); 