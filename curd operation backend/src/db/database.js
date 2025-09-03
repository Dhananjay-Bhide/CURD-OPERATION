// const {Client} = require('pg');
import PG from 'pg';
const { Client } = PG;

// import dotenv from 'dotenv';
// dotenv.config();

export const con = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

con.connect().then(() => {
    console.log('Connected to PostgreSQL database');

}).catch(err => {
    console.error('Connection error', err.stack);
});

process.on('SIGINT', async () => {
  await con.end();
  console.log('Database connection closed');
  process.exit(0);
});

// export default con;

