import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import db from './config/db.js'
import patientRoutes from './routes/patients.routes.js'
import indexRoutes from './routes/index.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(bodyParser.json()); // I think this is redundant. express.json() already does its functionality

// Check if DB connection works on server start (Optional)
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err)
  } else {
    console.log('Connected to MySQL database')
    connection.release() // Release the connection back to the pool
  }
})

// API to fetch patients

app.use('/', indexRoutes)
app.use('/patients', patientRoutes)
app.use('/auth', authRoutes)


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
