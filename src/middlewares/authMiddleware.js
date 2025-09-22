const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token ausente' });
  }

  // Split "Bearer" and "TOKEN" and just gets the Token
  const parts = authHeader.split(' ');
  const token = parts.length === 2 ? parts[1] : authHeader;

  if (!token) {
    return res.status(401).json({ error: 'Token ausente' });
  }

  try {
    const decoded = jwt.verify(token, process.env.VIREO_JWT_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = {authMiddleware}