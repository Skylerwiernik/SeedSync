import logo from './logo.svg';
import './App.css';


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import View from './pages/View';
import Admin from './pages/Admin';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view/:id" element={<View />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect all other routes */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
