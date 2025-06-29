import dotenv from 'dotenv'
dotenv.config()
import mysql from 'mysql2'

const pool = mysql.createPool({
  host: process.env.CLINIC_DB_HOST,
  user: process.env.CLINIC_DB_USER,
  password: process.env.CLINIC_DB_PASSWORD,
  database: process.env.CLINIC_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
