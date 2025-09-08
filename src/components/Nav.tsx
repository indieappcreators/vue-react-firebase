import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkAuthentication } from '../firebase/auth';
import type { AuthState } from '../firebase/types';

export default function Nav({ className }: { className: string }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await checkAuthentication();
      setAuthState(authResult);
    };
    checkAuth();
  }, []);

  if (authState.isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <nav className={className} data-testid="nav">
      <ul className="nav-list">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/todos">Todos</Link>
        </li>
        <li>
          {authState.isAuthenticated ? (
            <Link to="/logout">Logout</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  )
}