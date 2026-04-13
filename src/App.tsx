import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import DiscoverPage from './pages/DiscoverPage';
import FleetPage from './pages/FleetPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservation" element={<BookingPage />} />
        <Route path="/decouvrir-tetouan" element={<DiscoverPage />} />
        <Route path="/flotte" element={<FleetPage />} />
      </Routes>
    </Router>
  );
}

export default App;
