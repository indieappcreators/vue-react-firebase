import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Todos from './components/Todos';
import ProtectedRoute from './components/ProtectedRoute';
import Logout from './components/Logout';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-in/confirm" element={<Login />} />
          <Route path="/todos" element={
            <ProtectedRoute>
              <Todos />
            </ProtectedRoute>
          } />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
