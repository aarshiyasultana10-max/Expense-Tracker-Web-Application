import React from 'react';

function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <p>No expenses found. Add some!</p>;
  }

  return (
    <table className="expense-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Title</th>
          <th>Category</th>
          <th>Amount (₹)</th>
          <th>Note</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((exp) => (
          <tr key={exp.id}>
            <td>{exp.date}</td>
            <td>{exp.title}</td>
            <td>{exp.category}</td>
            <td>{Number(exp.amount).toFixed(2)}</td>
            <td>{exp.note}</td>
            <td>
              <button onClick={() => onEdit(exp)}>Edit</button>
              <button
                className="danger"
                onClick={() => onDelete(exp.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ExpenseList;
