const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection (Update with your SQLyog credentials)
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Use your MySQL password if set
    database: "mysql"
});

// Connect to database
db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database");
});

// Register User
app.post("/register", async (req, res) => {
    const { role, username, password } = req.body;

    if (!role || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const sql = "INSERT INTO users (role, username, password) VALUES (?, ?, ?)";
        db.query(sql, [role, username, hashedPassword], (err, result) => {
            if (err) {
                return res.status(400).json({ message: "Username already exists" });
            }
            res.status(201).json({ message: "Account created successfully" });
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login User
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        res.status(200).json({ message: "Login successful", role: user.role });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
