import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/marketing/Home';
import Terms from './pages/marketing/Terms';
import Privacy from './pages/marketing/Privacy';
import Cookie from './pages/marketing/Cookie';
import Partner from './pages/marketing/Partner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookie" element={<Cookie />} />
        <Route path="/partner" element={<Partner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
