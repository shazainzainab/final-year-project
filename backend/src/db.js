const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  port: parseInt(process.env.SQL_PORT, 10) || 1433,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: false, // set to true if you're on Azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to MSSQL');
    return pool;
  })
  .catch(err => {
    console.error('❌ Database Connection Failed! Bad Config: ', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};