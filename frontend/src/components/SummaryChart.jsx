import React from 'react';

function SummaryChart({ summary }) {
  if (!summary || summary.length === 0) return null;

  const max = Math.max(...summary.map((s) => Number(s.total) || 0));
  if (max === 0) return null;

  return (
    <div className="summary-chart">
      {summary.map((row) => {
        const value = Number(row.total) || 0;
        const width = `${(value / max) * 100}%`;
        return (
          <div key={row.category} className="summary-chart-row">
            <span className="label">{row.category}</span>
            <div className="bar">
              <div className="bar-fill" style={{ width }} />
            </div>
            <span className="value">₹{value.toFixed(0)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default SummaryChart;
