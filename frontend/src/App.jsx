import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Task from './components/Task'
import LoginSignup from './components/LoginSignup';
import { useEffect } from 'react';

// Tách component điều hướng
function NavigateOnAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      navigate('/task');
    } else {
      navigate('/sign');
    }
  }, [navigate]);

  return null; // Không render gì
}

function App() {
  return (
    <Router>
      <NavigateOnAuth />
      <Routes>
        <Route path='/sign' element={ <LoginSignup/> } />
        <Route path="/task" element={<Task />} />
      </Routes>
    </Router>
  );
}

export default App;
