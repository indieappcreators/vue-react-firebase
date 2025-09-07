import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthentication } from '../firebase/auth';
import type { AuthState } from '../firebase/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
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
        
        if (!authResult.isAuthenticated) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (authState.isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};

export default ProtectedRoute;
