const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado o formato inválido' });
      }

      const token = authHeader.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.userId };
      
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  }
};