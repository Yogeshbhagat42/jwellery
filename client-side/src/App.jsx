import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Category from "./components/Category";
import Footer from "./components/Footer";
import Products from "./components/Products";
import ShopPage from "./components/ShopPage";
import ProductDetails from "./components/ProductDetails";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import TrackOrder from "./pages/TrackOrder";
import JewelleryCare from "./pages/JewelleryCare";
import Privacy from "./pages/Privacy";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
              <Navbar />
              <Routes>
                <Route path="/" element={
                  <>
                    <Category />
                    <Products />
                  </>
                } />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/:category" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account" element={<Account />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/jewelry-care" element={<JewelleryCare />} />
                <Route path="/privacy" element={<Privacy />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
