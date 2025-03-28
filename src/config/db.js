import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'mydb',   
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения: ' + err.stack);
    return;
  }
  console.log('Подключено к базе данных с id ' + connection.threadId);
});

export default connection;
