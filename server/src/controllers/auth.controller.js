import db from '../config/db.js'
import bcrypt from 'bcryptjs'

export async function register(req, res) {
  const { role, username, password, fullName, email } = req.body

  if (!role || !username || !password || !fullName || !email) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user into database
    const sql =
      'INSERT INTO users (role, full_name, username, password, email) VALUES (?, ?, ?, ?, ?)'
    
    db.query(sql, [role, fullName, username, hashedPassword, email], (err, result) => {
      if (err) {
        console.error("Error inserting user:", err)
        return res.status(400).json({ message: 'Username or Email already exists' })
      }
      res.status(201).json({ message: 'Account created successfully' })
    })
  } catch (error) {
    console.error("Server Error:", error)
    res.status(500).json({ message: 'Server error' })
  }
}


export async function login(req, res) {
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
}

