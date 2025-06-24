# Agenda Sport Backend

Backend API para sistema de reservas de canchas deportivas desarrollado con Node.js, Express y Sequelize.

## Autores

- Agustín Patat
- Agustín Macello  
- Francisco Monzoni

## Descripción

API RESTful para gestionar reservas de canchas deportivas. Permite administrar deportes, canchas, horarios y reservas con validaciones completas y base de datos SQLite.

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web para Node.js
- **Sequelize** - ORM para base de datos
- **SQLite** - Base de datos relacional
- **Express Validator** - Validación de datos
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **Socket.io** - Comunicación en tiempo real

## Características

- **Validación Completa**: Todos los endpoints incluyen validación de datos con express-validator
- **Base de Datos Relacional**: Uso de Sequelize ORM con SQLite
- **CORS Configurado**: Soporte para múltiples orígenes
- **Manejo de Errores**: Middleware centralizado para manejo de errores
- **Asociaciones**: Relaciones entre modelos (Sport -> Court -> Booking/Schedule)
- **Almacenamiento Persistente**: Configuración para Render con disco persistente
- **API RESTful**: Endpoints siguiendo convenciones REST

## Scripts Disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo con nodemon
- `npm run seed` - Poblar la base de datos con datos iniciales

## Base de Datos

La aplicación utiliza SQLite como base de datos principal. En desarrollo, la base de datos se almacena localmente en `backend/db/database.sqlite`. En producción (Render), se utiliza un disco persistente en `/opt/render/project/data/database.sqlite`.
