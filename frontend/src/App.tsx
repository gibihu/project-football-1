import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './components/theme-provider';
import LoginPage from './pages/auth/login';
import Logout from './pages/auth/logout';
import RegisPage from './pages/auth/register';
import PackagesDashboard from './pages/dashboard/admins/package';
import UserPaymentPage from './pages/dashboard/admins/user-payment';
import UsersDashboard from './pages/dashboard/admins/users';
import DashboardHome from './pages/dashboard/page';
import PayMentPage from './pages/dashboard/payment';
import PaymentUploadPage from './pages/dashboard/payment-upload-page';
import PackPointPage from './pages/dashboard/point-page';
import WalletPage from './pages/dashboard/wallet';
import Home from './pages/home';
import { HistoryScore } from './pages/match/history-score';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisPage />} />
          
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/match/history" element={<HistoryScore />} />
          <Route path="/pack-point" element={<PackPointPage />} />

          {/* <Route path="/user/:id" element={<EditUser />} /> */}
          <Route path="/payment/upload/:id" element={<PaymentUploadPage />} />
          <Route path="/payment/:id" element={<PayMentPage />} />

         {/* admin  */}
          <Route path="/users" element={<UsersDashboard />} />
          <Route path="/user/payment" element={<UserPaymentPage />} />
          <Route path="/user/payment/:id" element={<UserPaymentPage />} />
          <Route path="/packages" element={<PackagesDashboard />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
