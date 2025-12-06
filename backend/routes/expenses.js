const express = require('express');
const db = require('../db');

const router = express.Router();

// GET all expenses with optional query filters
router.get('/', (req, res) => {
  const { category, fromDate, toDate } = req.query;
  let sql = 'SELECT * FROM expenses WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (fromDate) {
    sql += ' AND date >= ?';
    params.push(fromDate);
  }

  if (toDate) {
    sql += ' AND date <= ?';
    params.push(toDate);
  }

  sql += ' ORDER BY date DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// POST create new expense
router.post('/', (req, res) => {
  const { title, amount, category, date, note } = req.body;

  if (!title || !amount || !category || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql =
    'INSERT INTO expenses (title, amount, category, date, note) VALUES (?, ?, ?, ?, ?)';
  const params = [title, amount, category, date, note || null];

  db.run(sql, params, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({
      id: this.lastID,
      title,
      amount,
      category,
      date,
      note: note || null,
    });
  });
});

// PUT update expense
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date, note } = req.body;

  const sql =
    'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ?, note = ? WHERE id = ?';
  const params = [title, amount, category, date, note || null, id];

  db.run(sql, params, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ id: Number(id), title, amount, category, date, note: note || null });
  });
});

// DELETE expense
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM expenses WHERE id = ?';

  db.run(sql, id, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(204).send();
  });
});

// GET summary (total by category)
router.get('/summary/by-category', (req, res) => {
  const sql = `
    SELECT category, SUM(amount) as total
    FROM expenses
    GROUP BY category
    ORDER BY total DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

module.exports = router;
