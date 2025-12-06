const API_BASE = '/api';

async function handleJson(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data.error || res.statusText || 'Request failed';
    throw new Error(msg);
  }
  return res.json();
}

// 🔐 LOGIN
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleJson(res);
}

// 🔐 REGISTER
export async function registerUser({ name, email, password }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleJson(res);
}

// 📦 EXPENSE APIs
export async function fetchExpenses(userId, params = {}) {
  const query = new URLSearchParams({ ...params, userId }).toString();
  const res = await fetch(`${API_BASE}/expenses${query ? `?${query}` : ''}`, {
    headers: { 'x-user-id': userId },
  });
  return handleJson(res);
}

export async function createExpense(userId, data) {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ ...data, userId }),
  });
  return handleJson(res);
}

export async function updateExpense(userId, id, data) {
  const res = await fetch(`${API_BASE}/expenses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ ...data, userId }),
  });
  return handleJson(res);
}

export async function deleteExpense(userId, id) {
  const res = await fetch(`${API_BASE}/expenses/${id}`, {
    method: 'DELETE',
    headers: { 'x-user-id': userId },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data.error || res.statusText || 'Request failed';
    throw new Error(msg);
  }
  return true;
}

export async function fetchSummaryByCategory(userId) {
  const res = await fetch(`${API_BASE}/expenses/summary/by-category`, {
    headers: { 'x-user-id': userId },
  });
  return handleJson(res);
}
