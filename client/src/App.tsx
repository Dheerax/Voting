import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import VotingPage from './pages/VotingPage';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RegistrationPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="vote" element={<VotingPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
