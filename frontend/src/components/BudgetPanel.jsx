import React, { useEffect, useState } from 'react';

function BudgetPanel({ userId, currentMonthTotal }) {
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState('');

  // Load saved budget from localStorage
  useEffect(() => {
    if (!userId) return;
    const saved = localStorage.getItem(`budget-${userId}`);
    if (saved) {
      setBudget(saved);
    }
  }, [userId]);

  useEffect(() => {
    if (!budget) {
      setStatus('');
      return;
    }
    const b = Number(budget);
    const spent = Number(currentMonthTotal || 0);
    if (b <= 0) {
      setStatus('');
      return;
    }
    const pct = (spent / b) * 100;

    if (pct < 70) {
      setStatus('ok');
    } else if (pct < 100) {
      setStatus('warning');
    } else {
      setStatus('danger');
    }
  }, [budget, currentMonthTotal]);

  const handleSave = () => {
    if (!userId) return;
    if (!budget || Number(budget) <= 0) {
      alert('Please enter a valid positive budget amount.');
      return;
    }
    localStorage.setItem(`budget-${userId}`, budget);
    alert('Budget saved for this user!');
  };

  const spent = Number(currentMonthTotal || 0);
  const b = Number(budget || 0);
  const pct = b > 0 ? Math.min(999, (spent / b) * 100) : 0;

  return (
    <div className="budget-panel">
      <div className="budget-row">
        <div className="budget-input">
          <label>Monthly Budget (₹)</label>
          <div className="budget-input-inline">
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 10000"
              min="0"
            />
            <button type="button" className="small secondary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
        <div className="budget-numbers">
          <p>
            Spent this month: <strong>₹{spent.toFixed(2)}</strong>
          </p>
          {b > 0 && (
            <p>
              Used: <strong>{pct.toFixed(1)}%</strong>
            </p>
          )}
        </div>
      </div>

      {b > 0 && (
        <div className="budget-bar">
          <div className="budget-bar-track">
            <div
              className={`budget-bar-fill ${status}`}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
          <div className="budget-status">
            {status === 'ok' && (
              <span className="badge ok">✅ You&apos;re within the safe range.</span>
            )}
            {status === 'warning' && (
              <span className="badge warning">
                ⚠️ You&apos;re nearing your budget. Keep an eye on spending.
              </span>
            )}
            {status === 'danger' && (
              <span className="badge danger">
                🔴 You&apos;ve crossed the budget! Try reducing expenses.
              </span>
            )}
          </div>
        </div>
      )}
      {!budget && <p className="muted small">Set a monthly budget to track your spending.</p>}
    </div>
  );
}

export default BudgetPanel;
