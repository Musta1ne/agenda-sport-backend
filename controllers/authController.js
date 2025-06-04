const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Función auxiliar para generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
};

// Función auxiliar para excluir el password del objeto usuario
const excludePassword = (user) => {
  const { password, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
};

const authController = {
  // Registro de nuevo usuario
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validar datos requeridos
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: 'Nombre, email y contraseña son requeridos' 
        });
      }

      // Verificar si el email ya está registrado
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ 
          error: 'El email ya está registrado' 
        });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el usuario
      const user = await User.create({
        name,
        email,
        password: hashedPassword
      });

      // Generar token
      const token = generateToken(user);

      // Responder con usuario (sin password) y token
      res.status(201).json({
        user: excludePassword(user),
        token
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ 
        error: 'Error al registrar el usuario' 
      });
    }
  },

  // Login de usuario
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validar datos requeridos
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email y contraseña son requeridos' 
        });
      }

      // Buscar usuario por email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas' 
        });
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas' 
        });
      }

      // Generar token
      const token = generateToken(user);

      // Responder con usuario (sin password) y token
      res.json({
        user: excludePassword(user),
        token
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ 
        error: 'Error al iniciar sesión' 
      });
    }
  }
};

module.exports = authController;