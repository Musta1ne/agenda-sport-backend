const express = require("express");
const cors = require("cors");
const userRoutes = require("../routes/user.routes");
const fieldRoutes = require("../routes/field.routes");
const reservationRoutes = require("../routes/reservation.routes");
const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://mi-sitio-produccion.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Origen no permitido por CORS"));
      }
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", fieldRoutes);
app.use("/api/v1", reservationRoutes);

module.exports = app;
