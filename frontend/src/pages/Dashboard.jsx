import { useState, useEffect } from 'react';
import API from '../api';

export default function Dashboard({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', completed: false });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/users/profile/').then(r => setProfile(r.data));
    fetchTasks();
  }, []);

  const fetchTasks = () => API.get('/tasks/').then(r => setTasks(r.data));

  const flash = (type, text) => {
    type === 'success' ? setMsg(text) : setError(text);
    setTimeout(() => { setMsg(null); setError(null); }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/tasks/${editId}/`, form);
        flash('success', 'Task updated!');
      } else {
        await API.post('/tasks/', form);
        flash('success', 'Task created!');
      }
      setForm({ title: '', description: '', completed: false });
      setEditId(null);
      fetchTasks();
    } catch (err) {
      flash('error', JSON.stringify(err.response?.data || 'Something went wrong'));
    }
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setForm({ title: task.title, description: task.description, completed: task.completed });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}/`);
      flash('success', 'Task deleted!');
      fetchTasks();
    } catch {
      flash('error', 'Delete failed');
    }
  };

  const toggleComplete = async (task) => {
    try {
      await API.patch(`/tasks/${task.id}/`, { completed: !task.completed });
      fetchTasks();
    } catch {
      flash('error', 'Update failed');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Primetrade Dashboard</h1>
        {profile && <span>👤 {profile.username} {profile.is_admin && <span className="badge">Admin</span>}</span>}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      {msg && <p className="success">{msg}</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>{editId ? 'Edit Task' : 'New Task'}</h3>
        <form onSubmit={handleSubmit}>
          <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <label>
            <input type="checkbox" checked={form.completed} onChange={e => setForm({ ...form, completed: e.target.checked })} />
            {' '}Mark as completed
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit">{editId ? 'Update' : 'Create'}</button>
            {editId && <button type="button" className="cancel-btn" onClick={() => { setEditId(null); setForm({ title: '', description: '', completed: false }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="task-list">
        <h3>Tasks ({tasks.length})</h3>
        {tasks.length === 0 && <p className="empty">No tasks yet. Create one above!</p>}
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'done' : ''}`}>
            <div className="task-info">
              <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task)} />
              <div>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
              </div>
            </div>
            <div className="task-actions">
              <button className="edit-btn" onClick={() => handleEdit(task)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
