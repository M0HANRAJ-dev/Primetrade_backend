import { useState } from 'react';
import API from '../api';

export default function Login({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await API.post('/users/login/', form);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button type="submit">Login</button>
      </form>
      <p>No account? <span className="link" onClick={onSwitch}>Register</span></p>
    </div>
  );
}
