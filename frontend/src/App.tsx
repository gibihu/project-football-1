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
import NotFound from './pages/NotFound';
import { HistoryScore } from './pages/match/history-score';
import UsersDashboard from './pages/dashboard/admins/users';
import PackagesDashboard from './pages/dashboard/admins/package';
import EditUser from './pages/dashboard/admins/edit-user';
import PayMentPage from './pages/dashboard/payment';
import UserPaymentPage from './pages/dashboard/admins/user-payment';

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
          <Route path="/match/history" element={<HistoryScore />} />
          <Route path="/pack-point" element={<PackPointPage />} />

          {/* <Route path="/user/:id" element={<EditUser />} /> */}
          <Route path="/packages" element={<PackagesDashboard />} />
          <Route path="/payment/:id" element={<PayMentPage />} />

         {/* admin  */}
          <Route path="/users" element={<UsersDashboard />} />
          <Route path="/user/payment" element={<UserPaymentPage />} />
          <Route path="/user/payment/:id" element={<UserPaymentPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
