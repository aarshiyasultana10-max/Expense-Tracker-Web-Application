import React, { useEffect, useState } from 'react';
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  fetchSummaryByCategory,
} from './api';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import FilterBar from './components/FilterBar';
import AuthScreen from './components/AuthScreen';
import SummaryChart from './components/SummaryChart';
import MonthlyTrend from './components/MonthlyTrend';
import BudgetPanel from './components/BudgetPanel';
import './styles.css';

const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Other'];

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('expense-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [filters, setFilters] = useState({
    category: 'All',
    fromDate: '',
    toDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);

  // Load expenses + summary
  const loadData = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      setError('');
      const [expData, summaryData] = await Promise.all([
        fetchExpenses(currentUser.id, filters),
        fetchSummaryByCategory(currentUser.id),
      ]);
      setExpenses(expData);
      setSummary(summaryData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [currentUser, filters]);

  const handleAddOrUpdate = async (data) => {
    if (!currentUser) return;
    try {
      if (editingExpense) {
        await updateExpense(currentUser.id, editingExpense.id, data);
        setEditingExpense(null);
      } else {
        await createExpense(currentUser.id, data);
      }
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to save expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    if (!currentUser) return;
    try {
      await deleteExpense(currentUser.id, id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
    }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  // Current month total for budget + trend
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentMonthTotal = expenses.reduce((sum, e) => {
    const d = new Date(e.date);
    if (!isNaN(d) && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      return sum + Number(e.amount || 0);
    }
    return sum;
  }, 0);

  const handleLogout = () => {
    localStorage.removeItem('expense-user');
    setCurrentUser(null);
    setExpenses([]);
    setSummary([]);
  };

  if (!currentUser) {
    return (
      <div className="auth-wrapper">
        <AuthScreen
          onLogin={(user) => {
            localStorage.setItem('expense-user', JSON.stringify(user));
            setCurrentUser(user);
          }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>
            <span className="logo-icon">₹</span>
            Expense Tracker
          </h1>
          <p>Track your expenses with login, filters, summary, budget and CSV export.</p>
        </div>
        <div className="user-info">
          <span>Hi, {currentUser.name}</span>
          <button className="secondary small" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        <section className="card">
          <h2>Add / Edit Expense</h2>
          <ExpenseForm
            categories={categories}
            onSubmit={handleAddOrUpdate}
            editingExpense={editingExpense}
            onCancelEdit={() => setEditingExpense(null)}
          />
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Expenses</h2>
            <div className="total-amount">
              Total: <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <FilterBar
            categories={categories}
            filters={filters}
            onChange={setFilters}
          />

          <div className="list-actions">
            <button
              className="secondary small"
              onClick={() => {
                if (expenses.length === 0) {
                  alert('No expenses to export.');
                  return;
                }
                const header = ['Title', 'Amount', 'Category', 'Date', 'Note'];
                const rows = expenses.map((e) => [
                  e.title,
                  e.amount,
                  e.category,
                  e.date,
                  e.note || '',
                ]);
                const csvContent = [header, ...rows]
                  .map((r) => r.map(String).map((s) => `"${s.replace(/"/g, '""')}"`).join(','))
                  .join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'expenses.csv';
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && (
            <ExpenseList
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
            />
          )}
        </section>

        <section className="card">
          <h2>Summary & Insights</h2>

          <h3 className="section-subtitle">By Category</h3>
          {summary.length === 0 ? (
            <p>No data yet.</p>
          ) : (
            <>
              <ul className="summary-list">
                {summary.map((row) => (
                  <li key={row.category}>
                    <span>{row.category}</span>
                    <span>₹{Number(row.total).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <SummaryChart summary={summary} />
            </>
          )}

          <h3 className="section-subtitle">Monthly Trend</h3>
          <MonthlyTrend expenses={expenses} />

          <h3 className="section-subtitle">This Month&apos;s Budget</h3>
          <BudgetPanel
            userId={currentUser.id}
            currentMonthTotal={currentMonthTotal}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
