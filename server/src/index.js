import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import patientRoutes from './routes/patients.routes.js';
import indexRoutes from './routes/index.routes.js';
import authRoutes from './routes/auth.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';

const app = express();
const PORT = 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Handles JSON requests

// ✅ Check DB Connection on Server Start
db.getConnection((err, connection) => {
    if (err) {
        console.error('🔴 Database connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL database');
        connection.release(); // Release connection back to pool
    }
});

// ✅ Define Routes
app.use('/', indexRoutes);
app.use('/patients', patientRoutes);
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);

// ✅ Default Route for API Health Check
app.get('/api', (req, res) => {
    res.json({ message: "🚀 API is running!" });
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
