import React, { useEffect, useState } from 'react';

const initialState = {
  title: '',
  amount: '',
  category: 'Food',
  date: '',
  note: '',
};

function ExpenseForm({ categories, onSubmit, editingExpense, onCancelEdit }) {
  const [form, setForm] = useState(initialState);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date,
        note: editingExpense.note || '',
      });
    } else {
      setForm(initialState);
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category || !form.date) {
      alert('Please fill all required fields.');
      return;
    }
    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
    setForm(initialState);
  };

  // 🎤 Voice input: fill the Title field using browser speech recognition
  const handleVoiceTitle = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setForm((prev) => ({
        ...prev,
        title: transcript,
      }));
    };

    recognition.start();
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <div className="label-with-mic">
            <label>Title *</label>
            <button
              type="button"
              className="icon-button"
              onClick={handleVoiceTitle}
              title="Fill title using voice"
            >
              🎤
            </button>
          </div>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Grocery shopping"
          />
          {isListening && (
            <p className="muted small">Listening... please speak your expense title.</p>
          )}
        </div>
        <div className="form-group">
          <label>Amount (₹) *</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Note</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Optional description"
        />
      </div>

      <div className="form-actions">
        <button type="submit">
          {editingExpense ? 'Update Expense' : 'Add Expense'}
        </button>
        {editingExpense && (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ExpenseForm;
