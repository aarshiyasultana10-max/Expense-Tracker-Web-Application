const express = require('express');
const db = require('../db');

const router = express.Router();

// 🔐 Register a new user
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.run(sql, [name, email, password], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email already registered' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: this.lastID, name, email });
  });
});

// 🔐 Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = 'SELECT id, name, email, password FROM users WHERE email = ?';
  db.get(sql, [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // For project, we return user details directly (no JWT)
    res.json({ id: user.id, name: user.name, email: user.email });
  });
});

module.exports = router;
