# Full Stack Expense Tracker (HTML, CSS, JS, React, Express, SQL)

## Project Structure

- `backend/` - Node + Express + SQLite (SQL database)
- `frontend/` - React app using HTML, CSS, JavaScript

## How to Run

1. **Backend**
   ```bash
   cd backend
   npm install
   npm start   # starts Express API on http://localhost:5000
   ```

2. **Frontend**
   In a new terminal:
   ```bash
   cd frontend
   npm install
   npm start   # opens http://localhost:3000
   ```

React frontend will talk to Express backend through a proxy (`/api/...`).
