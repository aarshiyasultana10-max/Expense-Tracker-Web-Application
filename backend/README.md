# Expense Tracker Backend

## Setup

```bash
cd backend
npm install
npm start   # or: npm run dev
```

The API runs by default on `http://localhost:5000`.

### Endpoints

- `GET /api/expenses` - list expenses (supports `category`, `fromDate`, `toDate` as query params)
- `POST /api/expenses` - create expense
- `PUT /api/expenses/:id` - update expense
- `DELETE /api/expenses/:id` - delete expense
- `GET /api/expenses/summary/by-category` - total amount grouped by category
