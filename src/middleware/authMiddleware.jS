import { verifyToken } from '../utils/jwtUtils.js';

export const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(403).json({ message: 'Токен не предоставлен' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Неверный или просроченный токен' });
  }

  req.user = decoded;
  next();
};
