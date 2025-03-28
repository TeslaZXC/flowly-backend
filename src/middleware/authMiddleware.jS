const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token || token !== 'secret-token') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  next();
};

export default authMiddleware;