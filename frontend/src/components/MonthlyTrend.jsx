import React from 'react';

// Simple monthly bar chart using divs
function MonthlyTrend({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <p className="muted">Add some expenses to see the monthly trend.</p>;
  }

  // Group by YYYY-MM
  const monthlyMap = new Map();
  expenses.forEach((e) => {
    const d = new Date(e.date);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const current = monthlyMap.get(key) || 0;
    monthlyMap.set(key, current + Number(e.amount || 0));
  });

  const monthlyData = Array.from(monthlyMap.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => (a.month > b.month ? 1 : -1));

  const max = Math.max(...monthlyData.map((m) => m.total || 0));
  if (max === 0) {
    return <p className="muted">No valid amounts to show in trend.</p>;
  }

  return (
    <div className="monthly-chart">
      {monthlyData.map((row) => {
        const width = `${(row.total / max) * 100}%`;
        return (
          <div key={row.month} className="monthly-chart-row">
            <span className="month-label">{row.month}</span>
            <div className="bar">
              <div className="bar-fill" style={{ width }} />
            </div>
            <span className="value">₹{row.total.toFixed(0)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default MonthlyTrend;
