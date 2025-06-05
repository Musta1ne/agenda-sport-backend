# AgendaSport - Backend

Este proyecto es una API backend desarrollada en Node.js, Express y Sequelize para gestionar las reservas de canchas de fútbol y pádel. Forma parte del Trabajo Práctico 4 de la cátedra "Desarrollo de Software" (UTN - FRSFCO).

La aplicación permite a los usuarios ver canchas disponibles, reservar turnos y a los administradores gestionar los complejos deportivos.

---

## Objetivo

El objetivo de este backend es facilitar la gestión y reserva de canchas deportivas por parte de usuarios y clubes, permitiendo consultar disponibilidad, registrar reservas y administrar turnos de forma eficiente.

---

## Requisitos Técnicos Generales

- **API REST**: Rutas CRUD para gestión de usuarios, complejos (venues), canchas, deportes y reservas.
- **Autenticación**: Autenticación de usuarios mediante tokens JWT.
- **Base de Datos**: Implementación con SQLite usando Sequelize como ORM.

---

## Requisitos Técnicos Específicos

- **Gestión de Complejos (Venues)**: Crear, editar, ver y eliminar complejos deportivos.
- **Gestión de Canchas (Courts)**: Asociadas a un complejo y a un deporte. Incluye disponibilidad horaria.
- **Gestión de Deportes (Sports)**: Listado y CRUD de deportes como fútbol, pádel, etc.
- **Gestión de Reservas (Bookings)**: Los usuarios pueden reservar turnos en canchas disponibles.
- **Manejo de Usuarios**: Registro e inicio de sesión utilizando JWT para proteger rutas privadas.

---

## Funcionalidades Implementadas

- **Autenticación**:
  - Registro de usuarios
  - Login con generación de token JWT
  - Middleware para proteger rutas privadas

- **Complejos deportivos (Venues)**:
  - CRUD completo
  - Listado de canchas asociadas a cada complejo

- **Canchas (Courts)**:
  - CRUD completo
  - Asociación a un complejo y a un deporte
  - Endpoint para consultar disponibilidad horaria

- **Deportes (Sports)**:
  - CRUD de deportes disponibles

- **Reservas (Bookings)**:
  - Crear, consultar, editar y cancelar reservas
  - Restricciones de horarios posibles (según implementación)

---

## Librerías Utilizadas

- **Express**: Framework de Node.js para construir el servidor y manejar rutas.
- **Sequelize**: ORM para manejar la base de datos de forma sencilla.
- **SQLite**: Base de datos liviana usada en desarrollo.
- **dotenv**: Para manejar variables de entorno.
- **jsonwebtoken (JWT)**: Para autenticación de usuarios.
- **bcryptjs**: Para hashear contraseñas.
- **express-validator**: Para validar datos de entrada en las peticiones.

---

## Ejecución del Proyecto

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/agenda-sport-backend.git
   cd agenda-sport-backend
