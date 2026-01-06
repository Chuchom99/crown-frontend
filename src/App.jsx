import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import Quote from "./pages/Quote";
import QuoteResult from "./pages/QuoteResult";
import NotFound from "./pages/NotFound.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

function AdminProtected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container py-10">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container py-10">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-dvh flex flex-col">
          {isAdmin ? null : <Navbar />}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/quote" element={<Quote />} />
              <Route path="/quote/result" element={<QuoteResult />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/account"
                element={
                  <Protected>
                    <Account />
                  </Protected>
                }
              />

              <Route
                path="/admin/*"
                element={
                  <AdminProtected>
                    <AdminLayout />
                  </AdminProtected>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {isAdmin ? null : <Footer />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
