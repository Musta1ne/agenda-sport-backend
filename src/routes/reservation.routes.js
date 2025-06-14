const router = require("express").Router();
const { Reservations, Users, Fields } = require("../../models");

router.get("/reservations", async (req, res) => {
  try {
    const reservations = await Reservations.findAll({
      include: [
        { model: Users, as: "user" },
        { model: Fields, as: "field" },
      ],
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/reservations/:id", async (req, res) => {
  try {
    const reservation = await Reservations.findOne({
      where: { id: req.params.id },
      include: [
        { model: Users, as: "user" },
        { model: Fields, as: "field" },
      ],
    });
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404).json({ error: "Reserva no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/reservation/:fieldId", async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { date, startTime, id_user } = req.body;
    if (!date || !startTime || !id_user || !fieldId) {
      return res
        .status(400)
        .json({ message: "Faltan parámetros para crear la reserva" });
    }
    const newReservation = await Reservations.create({
      date,
      startTime,
      id_user,
      id_field: fieldId,
    });
    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    res.status(500).json({ message: "Error al crear la reserva" });
  }
});

module.exports = router;
