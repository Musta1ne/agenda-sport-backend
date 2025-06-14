require("dotenv").config();
const app = require("./app/app");
const { Sequelize } = require("sequelize");
const config = require("../config/config.json");

const dbConfig = config.development;
const PORT = process.env.PORT || 3000;

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((err) => {
    console.error("No se pudo conectar a la base de datos:", err);
  });
