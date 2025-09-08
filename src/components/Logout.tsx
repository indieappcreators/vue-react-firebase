import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../firebase/auth';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut();
        navigate('/login');
      } catch (error) {
        console.error('Error during logout:', error);
        navigate('/login'); // Navigate anyway
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;