import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TravelForm from './components/TravelForm';
import ResultPage from './components/ResultPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>🌍 Travel Recommendation App</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<TravelForm />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
