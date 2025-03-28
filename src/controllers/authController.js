import bcrypt from 'bcryptjs';
import { createUser, findUserByUsername } from '../models/userModel.js';
import { generateToken } from '../utils/jwtUtils.js';

export const register = async (req, res) => {
  const { username, password, personalInfo } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    createUser(username, hashedPassword, personalInfo, (err, result) => {
      if (err) return res.status(500).json({ message: 'Ошибка регистрации' });

      const token = generateToken({ id: result.insertId, username, personal_info: personalInfo });
      res.status(201).json({ token });
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const login = (req, res) => {
  const { username, password } = req.body;

  findUserByUsername(username, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    const token = generateToken(user);
    res.json({ token });
  });
};
