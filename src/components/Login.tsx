import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendSignInLink, signInWithLink } from '../firebase/auth';
import type { LoginFormData } from '../firebase/types';
import Nav from './Nav';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('success');
    }, 5000);
  };

  const handleSendSignInLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showMessage('Please enter your email address', 'error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const formData: LoginFormData = { email };
      await sendSignInLink(formData);
      showMessage('Check your email for the sign-in link!', 'success');
      setEmail('');
    } catch (error) {
      showMessage('Failed to send sign-in link. Please try again.', 'error');
      console.error('Sign-in link error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is signing in with a link
  const checkSignInLink = async () => {
    const link = window.location.href;
    
    if (link.includes('sign-in/confirm')) {
      try {
        const user = await signInWithLink({ link });
        if (user) {
          showMessage('Successfully signed in!', 'success');
          navigate('/');
        }
      } catch (error) {
        showMessage('Failed to sign in with link. Please try again.', 'error');
        console.error('Sign-in with link error:', error);
      }
    }
  };

  // Check for sign-in link on component mount
  useEffect(() => {
    checkSignInLink();
  }, []);

  return (
    <div>
      <h1>Login</h1>
      <Nav className="nav" />
      <form onSubmit={handleSendSignInLink}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Sign-In Link'}
        </button>
      </form>
      
      {message && (
        <div>
          {message}
        </div>
      )}
    </div>
  );
};

export default Login;
