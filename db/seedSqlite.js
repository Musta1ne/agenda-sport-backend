import { connectSQLite } from './sqlite.js';

async function seed() {
  const db = await connectSQLite();

  // Borrar todo
  await db.run("DELETE FROM deportes");
  await db.run("DELETE FROM canchas");
  await db.run("DELETE FROM reservas");
  await db.run("DELETE FROM bloqueos");
  await db.run("DELETE FROM horarios");
  await db.run("DELETE FROM pagos");

  const deportes = [
    { nombre: 'Fútbol 5' },
    { nombre: 'Fútbol 7' },
    { nombre: 'Pádel' }
  ];

  for (const dep of deportes) {
    await db.run("INSERT INTO deportes (nombre) VALUES (?)", [dep.nombre]);
  }

  // Obtener los IDs de deportes
  const futbol5 = await db.get("SELECT id FROM deportes WHERE nombre = 'Fútbol 5'");
  const futbol7 = await db.get("SELECT id FROM deportes WHERE nombre = 'Fútbol 7'");
  const padel = await db.get("SELECT id FROM deportes WHERE nombre = 'Pádel'");

  // Insertar canchas de ejemplo
  const canchas = [
    {
      nombre: 'Fútbol 5 - Cancha 1',
      tipo: 'Fútbol 5',
      tipo_superficie: 'sintética',
      estado: 'disponible',
      precio: 30000,
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTWyHaf8n4fbpp9KJJRxriCbnVNH436V_soQ&s',
      id_deporte: futbol5.id
    },
    {
      nombre: 'Fútbol 7 - Cancha 1',
      tipo: 'Fútbol 7',
      tipo_superficie: 'sintética',
      estado: 'disponible',
      precio: 40000,
      imagen: 'https://www.record.com.mx/sites/default/files/articulos/2023/10/15/pexels-pixabay-274506_1-20.jpg',
      id_deporte: futbol7.id
    },
    {
      nombre: 'Pádel - Cancha 1',
      tipo: 'Pádel',
      tipo_superficie: 'sintética',
      estado: 'disponible',
      precio: 20000,
      imagen: 'https://cdn.pixabay.com/photo/2021/06/04/06/54/racket-6308994_1280.jpg',
      id_deporte: padel.id
    }
  ];

  for (const c of canchas) {
    const result = await db.run(
      "INSERT INTO canchas (nombre, tipo, tipo_superficie, estado, precio, imagen, id_deporte) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [c.nombre, c.tipo, c.tipo_superficie, c.estado, c.precio, c.imagen, c.id_deporte]
    );
    const canchaId = result.lastID;
    let horariosCount = 0;
    // Agregar horarios según el tipo de cancha
    if (c.tipo === 'Pádel') {
      // Turnos de 1:30h, de 8:00 a 23:00
      let hora = 8 * 60; // minutos
      while (hora + 90 <= 23 * 60) {
        const hInicio = Math.floor(hora / 60).toString().padStart(2, '0') + ':' + (hora % 60).toString().padStart(2, '0');
        const hFin = Math.floor((hora + 90) / 60).toString().padStart(2, '0') + ':' + ((hora + 90) % 60).toString().padStart(2, '0');
        await db.run(
          "INSERT INTO horarios (id_cancha, dia_semana, hora_inicio, hora_fin, activo) VALUES (?, ?, ?, ?, 1)",
          [canchaId, 'todos', hInicio, hFin]
        );
        hora += 90;
        horariosCount++;
      }
    } else {
      // Fútbol 5 y 7: turnos de 1h, de 8:00 a 23:00
      for (let h = 8; h < 23; h++) {
        const hInicio = h.toString().padStart(2, '0') + ':00';
        const hFin = (h + 1).toString().padStart(2, '0') + ':00';
        await db.run(
          "INSERT INTO horarios (id_cancha, dia_semana, hora_inicio, hora_fin, activo) VALUES (?, ?, ?, ?, 1)",
          [canchaId, 'todos', hInicio, hFin]
        );
        horariosCount++;
      }
    }
    console.log(`Horarios insertados para ${c.nombre}: ${horariosCount}`);
  }

  console.log('Base de datos SQLite poblada con datos de ejemplo.');
  await db.close();
}

seed();