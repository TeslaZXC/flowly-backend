import db from '../config/db.js';

export const createUser = (username, password, personalInfo, callback) => {
  const query = 'INSERT INTO users (username, password, personal_info) VALUES (?, ?, ?)';
  db.query(query, [username, password, JSON.stringify(personalInfo)], callback);
};

export const findUserByUsername = (username, callback) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], callback);
};
