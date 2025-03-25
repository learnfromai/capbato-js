import express from 'express';
import cors from 'cors';
import db from './config/db.js';

import patientRoutes from './routes/patients.routes.js';
import indexRoutes from './routes/index.routes.js';
import authRoutes from './routes/auth.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON

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
app.use('/', indexRoutes);                      // Health check or landing routes
app.use('/patients', patientRoutes);            // e.g., /patients/add-patient
app.use('/auth', authRoutes);                   // e.g., /auth/login
app.use('/appointments', appointmentRoutes);    // /appointments/update/:id

// API status check
app.get('/api', (req, res) => {
  res.json({ message: 'API is running!' });
});

// 404 Handler (keep after routes)
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
  console.log(`Server running at http://localhost:${PORT}`);
});
