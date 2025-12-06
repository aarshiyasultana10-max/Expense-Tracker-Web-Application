import React from 'react';

function FilterBar({ categories, filters, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filter-bar">
      <div className="form-group">
        <label>Category</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="All">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>From</label>
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>To</label>
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default FilterBar;
