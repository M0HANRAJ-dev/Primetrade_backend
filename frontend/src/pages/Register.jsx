import { useState } from 'react';
import API from '../api';

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', is_admin: false });
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null); setError(null);
    try {
      await API.post('/users/register/', form);
      setMsg('Registered successfully! Please login.');
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Registration failed'));
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      {msg && <p className="success">{msg}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <label>
          <input type="checkbox" checked={form.is_admin} onChange={e => setForm({ ...form, is_admin: e.target.checked })} />
          {' '}Register as Admin
        </label>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <span className="link" onClick={onSwitch}>Login</span></p>
    </div>
  );
}
