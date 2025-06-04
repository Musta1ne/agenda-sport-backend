require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

// Función asíncrona para inicializar el servidor
async function startServer() {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync();
    console.log('Base de datos sincronizada correctamente');

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer();