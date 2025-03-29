import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

const register = (req, res) => {
  const { login, password, socialNetworkData } = req.body;

  if (!login || !password || !socialNetworkData) {
    return res.status(400).json({ message: 'Все поля обязательны.' });
  }

  // Хеширование пароля
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Генерация JWT токена
  const token = jwt.sign({ login, socialNetworkData }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });

  const query = 'INSERT INTO users (login, password, jwt_token) VALUES (?, ?, ?)';
  db.execute(query, [login, hashedPassword, token], (err, result) => {
    if (err) {
      console.error('Ошибка при выполнении запроса:', err);  // Логирование ошибки
      return res.status(500).json({ message: 'Ошибка при сохранении данных.' });
    }
    console.log('Результат запроса:', result);  // Логирование результата запроса
    res.status(201).json({ message: 'Пользователь зарегистрирован!', token });
  });
};

const updateSocialNetworkData = (req, res) => {
  const { login, socialNetworkData } = req.body;

  if (!login || !socialNetworkData) {
    return res.status(400).json({ message: 'Введите логин и данные социальных сетей.' });
  }

  // Получаем пользователя по логину
  const query = 'SELECT * FROM users WHERE login = ?';
  db.execute(query, [login], (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).json({ message: 'Пользователь не найден.' });
    }

    const user = result[0];

    // Перегенерация JWT токена с новыми данными социальных сетей
    const updatedToken = jwt.sign(
      { login: user.login, socialNetworkData },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Обновляем токен в базе данных
    const updateTokenQuery = 'UPDATE users SET jwt_token = ? WHERE login = ?';
    db.execute(updateTokenQuery, [updatedToken, login], (err, result) => {
      if (err) {
        console.error('Ошибка при обновлении токена:', err);
        return res.status(500).json({ message: 'Ошибка при обновлении токена.' });
      }

      res.status(200).json({ message: 'Данные социальных сетей обновлены и токен перегенерирован!', token: updatedToken });
    });
  });
};

const login = (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Введите логин и пароль.' });
  }

  const query = 'SELECT * FROM users WHERE login = ?';
  db.execute(query, [login], (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).json({ message: 'Неверные данные.' });
    }

    const user = result[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверный пароль.' });
    }

    const decoded = jwt.verify(user.jwt_token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Успешный вход!', token: user.jwt_token, user: decoded });
  });
};

export { register, login,updateSocialNetworkData };
