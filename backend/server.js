const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const expensesRouter = require('./routes/expenses');
const authRouter = require('./routes/auth'); // 🔐 NEW

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/expenses', expensesRouter);
app.use('/api/auth', authRouter); // 🔐 NEW

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Expense Tracker API is running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
