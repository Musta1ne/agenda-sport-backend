import { connectSQLite } from './sqlite.js';

async function seed() {
  const db = await connectSQLite();

  // Insertar deportes solo si no existen
  const deportesExist = await db.get("SELECT COUNT(*) as count FROM deportes");
  if (deportesExist.count === 0) {
    const deportes = [
      { nombre: 'Fútbol 5' },
      { nombre: 'Fútbol 7' },
      { nombre: 'Pádel' }
    ];
    for (const dep of deportes) {
      await db.run("INSERT INTO deportes (nombre) VALUES (?)", [dep.nombre]);
    }
  }

  // Obtener los IDs de deportes
  const futbol5 = await db.get("SELECT id FROM deportes WHERE nombre = 'Fútbol 5'");
  const futbol7 = await db.get("SELECT id FROM deportes WHERE nombre = 'Fútbol 7'");
  const padel = await db.get("SELECT id FROM deportes WHERE nombre = 'Pádel'");

  // Insertar canchas solo si no existen
  const canchasExist = await db.get("SELECT COUNT(*) as count FROM canchas");
  if (canchasExist.count === 0) {
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
      // Agregar horarios según el tipo de cancha
      if (c.tipo === 'Pádel') {
        let hora = 8 * 60;
        while (hora + 90 <= 23 * 60) {
          const hInicio = Math.floor(hora / 60).toString().padStart(2, '0') + ':' + (hora % 60).toString().padStart(2, '0');
          const hFin = Math.floor((hora + 90) / 60).toString().padStart(2, '0') + ':' + ((hora + 90) % 60).toString().padStart(2, '0');
          await db.run(
            "INSERT INTO horarios (id_cancha, dia_semana, hora_inicio, hora_fin, activo) VALUES (?, ?, ?, ?, 1)",
            [canchaId, 'todos', hInicio, hFin]
          );
          hora += 90;
        }
      } else {
        for (let h = 8; h < 23; h++) {
          const hInicio = h.toString().padStart(2, '0') + ':00';
          const hFin = (h + 1).toString().padStart(2, '0') + ':00';
          await db.run(
            "INSERT INTO horarios (id_cancha, dia_semana, hora_inicio, hora_fin, activo) VALUES (?, ?, ?, ?, 1)",
            [canchaId, 'todos', hInicio, hFin]
          );
        }
      }
    }
  }

  console.log('Base de datos SQLite inicializada solo con deportes, canchas y horarios.');
  await db.close();
}

seed();