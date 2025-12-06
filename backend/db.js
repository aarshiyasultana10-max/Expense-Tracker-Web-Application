const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'expense_tracker.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create tables
db.serialize(() => {
  // 🔐 Users table
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );`,
    (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table is ready.');
      }
    }
  );

  // 💰 Expenses table
  db.run(
    `CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );`,
    (err) => {
      if (err) {
        console.error('Error creating expenses table:', err.message);
      } else {
        console.log('Expenses table is ready.');
      }
    }
  );

  // Optional demo user
  db.run(
    `INSERT OR IGNORE INTO users (id, name, email, password)
     VALUES (1, 'Demo User', 'demo@example.com', 'password');`
  );
});

module.exports = db;
