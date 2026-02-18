import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CartProvider } from './contexts/CartContext';

// Auth Pages
import LandingPage from './pages/auth/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Layout & Owner Pages
import Layout from './components/Layout';
import Dashboard from './pages/owner/Dashboard';
import Reports from './pages/owner/Reports';
import Products from './pages/owner/Products';
import ProductCreate from './pages/owner/ProductCreate';
import ProductEdit from './pages/owner/ProductEdit';

// Kasir Pages
import KasirDashboard from "./pages/cashier/KasirDashboard";
import TransactionList from './pages/cashier/Transaction';
import PendingOrders from './pages/cashier/PendingOrders';
import PrintReceipt from './pages/cashier/PrintReceipt'; 

// Customer Pages
import CustomerHome from './pages/customer/CustomerHome';
import CategoryProducts from './pages/customer/CategoryProducts';
import Cart from './pages/customer/Cart'; 
import CustomerReceipt from './pages/customer/Receipt'; 

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData && typeof userData === 'object' && userData.role) {
          setUser(userData);
        }
      } catch (err) {
        console.warn('User data corrupt, clearing...');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Memuat...</div>
      </div>
    );
  }

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Owner Routes */}
          <Route path="/dashboard" element={<Layout />}>
            <Route 
              path="owner" 
              element={user?.role === 'owner' ? <Dashboard /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="reports" 
              element={user?.role === 'owner' ? <Reports /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="products" 
              element={user?.role === 'owner' ? <Products /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="products/create" 
              element={user?.role === 'owner' ? <ProductCreate /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="products/edit/:id" 
              element={user?.role === 'owner' ? <ProductEdit /> : <Navigate to="/login" replace />} 
            />
          </Route>

          {/* Kasir Routes */}
          <Route 
            path="/dashboard/cashier" 
            element={user?.role === 'kasir' ? <KasirDashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/dashboard/cashier/transactions" 
            element={user?.role === 'kasir' ? <TransactionList /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/dashboard/cashier/pending-orders" 
            element={user?.role === 'kasir' ? <PendingOrders /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/dashboard/cashier/receipt/:id" 
            element={user?.role === 'kasir' ? <PrintReceipt /> : <Navigate to="/login" replace />} 
          />

          {/* Customer Routes */}
          <Route 
            path="/customer" 
            element={user?.role === 'user' ? <CustomerHome /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/customer/category/:id" 
            element={user?.role === 'user' ? <CategoryProducts /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/customer/cart" 
            element={user?.role === 'user' ? <Cart /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/customer/receipt/:id" 
            element={user?.role === 'user' ? <CustomerReceipt /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}