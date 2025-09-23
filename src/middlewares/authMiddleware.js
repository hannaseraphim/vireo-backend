const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const token = req.cookies.vireoAccessCookie;

  if (!token) {
    return res.status(401).json({ error: 'Token is missing.' });
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