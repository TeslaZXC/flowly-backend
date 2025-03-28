import jwt from 'jsonwebtoken';

const secretKey = 'your_secret_key'; 

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    personal_info: user.personal_info,
  };

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};
