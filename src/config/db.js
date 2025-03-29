import mysql from 'mysql2';

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

db.connect(err => {
  if (err) {
    console.error('Ошибка подключения к базе данных: ', err);
  } else {
    console.log('Успешное подключение к базе данных.');
  }
});

export default db;
