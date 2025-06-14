
-------

Este proyecto es una API backend desarrollada en Node.js y Express para gestionar las reservas de canchas de fútbol en la ciudad de San Francisco. Ofrece endpoints para manejar usuarios, canchas y reservas.

## Objetivo

El objetivo de este backend es permitir a los usuarios reservar canchas y ver la disponibilidad de horarios.

## Requisitos Técnicos Generales

- **API REST**: Proporciona rutas CRUD para la gestión de canchas, usuarios y reservas.
- **Autenticación**: Incluye autenticación de usuarios mediante tokens.
- **Base de Datos**: Implementación en MySQL para almacenamiento de datos.

## Requisitos Técnicos Específicos

- **Manejo de Canchas**: Creación, actualización y eliminación de canchas disponibles para reserva.
- **Gestión de Reservas**: Permite a los usuarios reservar canchas en horarios específicos, de 4 pm a 10 pm.
- **Manejo de Usuarios**: Permite registro e inicio de sesión, utilizando autenticación con JWT.

## Funcionalidades Implementadas

- **CRUD de canchas**: Crea, lee, actualiza y elimina registros de canchas.
- **Reservas de canchas**: Gestión de las reservas de acuerdo a la disponibilidad.
- **Autenticación**: Seguridad en el acceso a las rutas mediante JWT.

## Librerías Utilizadas

- **Express**: Para la creación del servidor y manejo de rutas.
- **MySQL**: Base de datos para almacenamiento.
- **JWT**: Autenticación de usuarios.
- **Sequelize**: ORM para interactuar con la base de datos MySQL, simplificando las consultas y el manejo de datos.
