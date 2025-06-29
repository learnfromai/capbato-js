import express from 'express';
import cors from 'cors';
import db from './config/db.js';

import patientRoutes from './routes/patients.routes.js';
import indexRoutes from './routes/index.routes.js';
import authRoutes from './routes/auth.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';
import laboratoryRoutes from './routes/laboratory.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import doctorRoutes from './routes/doctors.routes.js'; // ✅ ADDED

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger (for debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Test DB connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
    connection.release();
  }
});

// API Routes
app.use('/', indexRoutes);
app.use('/patients', patientRoutes);
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/api', laboratoryRoutes);
app.use('/schedules', scheduleRoutes);
app.use('/doctors', doctorRoutes); // ✅ REGISTERED ROUTE

// API status check
app.get('/api', (req, res) => {
  res.json({ message: 'API is running!' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
