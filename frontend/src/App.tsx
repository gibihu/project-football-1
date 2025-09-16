import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './components/theme-provider';
import Home from './pages/home';
import LoginPage from './pages/auth/login';
import RegisPage from './pages/auth/register';
import DashboardHome from './pages/dashboard/page';
import { MatchDashboard } from './pages/match-dashboard';
import Logout from './pages/auth/logout';
import WalletPage from './pages/dashboard/wallet';
import PackPointPage from './pages/dashboard/point-page';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MatchDashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisPage />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/pack-point" element={<PackPointPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
