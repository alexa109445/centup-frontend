import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registrazione from './pages/Registrazione';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AggiungiCarta from './pages/AggiungiCarta';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registrazione" element={<Registrazione />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aggiungi-carta" element={<AggiungiCarta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;