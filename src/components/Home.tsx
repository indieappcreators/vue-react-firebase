import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthentication, signOut } from '../firebase/auth';
import type { User, AuthState } from '../firebase/types';
import Nav from './Nav';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResult = await checkAuthentication();
        setAuthState(authResult);
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Home</h1>
      <Nav className="nav" />
      {authState.isLoading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : authState.isAuthenticated && authState.user ? (
        <div>
          <h2>Hello, {authState.user.email}</h2>
          <p>You are signed in.</p>
          <button onClick={() => navigate('/todos')}>
            View Todos
          </button>
        </div>
      ) : (
        <div>
          <h2>Not signed in</h2>
          <p>Please sign in to continue.</p>
          <button onClick={goToLogin}>
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
