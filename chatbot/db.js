const db = require('mariadb');
const winston = require('./res/winston');

const pool = db.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  connectionLimit: 5
});

pool.getConnection().then(p => {
  if (p.isValid()) {
    winston.info("connected to database");
  } else {
    throw "could not connect to database";
  }
});

module.exports = pool;