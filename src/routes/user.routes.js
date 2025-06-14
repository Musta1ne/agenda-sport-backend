const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../../models");

const authMiddleware = require("../middleware/auth-middleware");
const SECRET_KEY = process.env.SECRET_KEY;

router.get("/users", async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users/:id", authMiddleware, async (req, res) => {
  try {
    const user = await Users.findOne({ where: { id: req.params.id } });
    if (user) res.json(user);
    else res.status(404).json({ error: "Usuario no encontrado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({ token, userId: newUser.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Contraseña incorrecta" });
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await Users.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedUser[0]) {
      res.json({ message: "Usuario actualizado" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const rowsDeleted = await Users.destroy({ where: { id: req.params.id } });
    if (rowsDeleted) {
      res.json({ message: "Usuario eliminado" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
