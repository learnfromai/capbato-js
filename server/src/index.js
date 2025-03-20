import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import patientRoutes from './routes/patients.routes.js';
import indexRoutes from './routes/index.routes.js';
import authRoutes from './routes/auth.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // Handles JSON requests

db.getConnection((err, connection) => {
    if (err) {
        console.error('🔴 Database connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL database');
        connection.release(); 
    }
});

app.use('/', indexRoutes);
app.use('/patients', patientRoutes);
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);

app.get('/api', (req, res) => {
    res.json({ message: "🚀 API is running!" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
