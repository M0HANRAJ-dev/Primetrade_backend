import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [page, setPage] = useState('login');
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('access'));

  if (isAuth) return <Dashboard onLogout={() => setIsAuth(false)} />;

  return (
    <div className="auth-container">
      <div className="brand">
        <h1>⚡ Primetrade</h1>
        <p>Task Management Platform</p>
      </div>
      {page === 'login'
        ? <Login onLogin={() => setIsAuth(true)} onSwitch={() => setPage('register')} />
        : <Register onSwitch={() => setPage('login')} />
      }
    </div>
  );
}
