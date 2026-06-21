import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import Fruits from './pages/Fruits';
import LearnMore from './pages/LearnMore';

import CartPage from './pages/CartPage';
import Dashboard from './pages/Dashboard';
import ExploreFarm from './pages/ExploreFarm';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ShopModal from './components/ShopModal';
import ContactModal from './components/ContactModal';
import ProfileModal from './components/ProfileModal';
import SearchModal from './components/SearchModal';
import SustainabilityModal from './components/SustainabilityModal';
import Scene3D from './components/Scene3D';

// API/Session Keys
import { 
  ACCESS_TOKEN_KEY, 
  REFRESH_TOKEN_KEY, 
  ACTIVE_USER_KEY,
  clearAuthSession,
  apiRequest,
  getValidAccessToken
} from './lib/api';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(ACTIVE_USER_KEY);
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  });

  // Cart State
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('naturalfoods_cart');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  // Pending checkout flow (auth → shop)
  const pendingCheckoutRef = useRef(false);

  // UI / Modals State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('naturalfoods_theme') || 'dark';
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSustainabilityOpen, setIsSustainabilityOpen] = useState(false);

  // Sync Cart to localStorage
  useEffect(() => {
    localStorage.setItem('naturalfoods_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync Theme to HTML data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('naturalfoods_theme', theme);
  }, [theme]);

  // Sync User/Token from localStorage on change
  useEffect(() => {
    const checkAuth = () => {
      const activeUser = localStorage.getItem(ACTIVE_USER_KEY);
      const activeToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      
      try {
        setUser(activeUser ? JSON.parse(activeUser) : null);
      } catch (_) {
        setUser(null);
      }
      setToken(activeToken);

      // Simple Auth App backward compatibility
      if (activeToken) {
        localStorage.setItem('access_token', activeToken);
      }
      const refToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refToken) {
        localStorage.setItem('refresh_token', refToken);
      }
    };

    window.addEventListener('storage', checkAuth);
    // Periodically sync in case storage events don't fire on the same window
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLoginSuccess = (userObj, redirectTo) => {
    const activeUser = localStorage.getItem(ACTIVE_USER_KEY);
    const activeToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    try {
      setUser(activeUser ? JSON.parse(activeUser) : userObj);
    } catch (_) {
      setUser(userObj);
    }
    setToken(activeToken);

    // Backward compatibility for simple Auth App
    if (activeToken) {
      localStorage.setItem('access_token', activeToken);
      const refToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refToken) {
        localStorage.setItem('refresh_token', refToken);
      }
    }

    // If checkout was pending before auth, open shop modal now
    if (pendingCheckoutRef.current) {
      pendingCheckoutRef.current = false;
      setIsShopOpen(true);
      return;
    }

    // Redirect based on user role (backend sends redirect_to in login response)
    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setToken(null);
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleProfileUpdate = async (formData) => {
    try {
      const activeToken = await getValidAccessToken();
      const updatedUser = await apiRequest('/api/dashboard/profile/', {
        method: 'PATCH',
        token: activeToken,
        body: {
          username: formData.username,
          email: formData.email,
          phone: formData.phone || '',
        },
      });
      // Persist updated user info
      const merged = { ...user, ...updatedUser };
      setUser(merged);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(merged));
    } catch (err) {
      console.error('Profile update failed:', err);
      alert('Profile update failed: ' + (err.message || 'Unknown error'));
    }
  };

  // Cart Actions
  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + item.qty, price: i.price + item.price } : i
        );
      }
      return [...prev, item];
    });
  };

  const handleUpdateCartItem = (itemId, qty, price, name) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, qty, price, ...(name !== undefined && { name }) } : i))
    );
  };

  const handleRemoveCartItem = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  // If not logged in, require auth before opening checkout
  const handleCheckoutClick = () => {
    if (user) {
      setIsShopOpen(true);
    } else {
      pendingCheckoutRef.current = true;
      setIsAuthOpen(true);
    }
  };

  const handleShopSuccess = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const isStorefront = 
    location.pathname === '/' || 
    location.pathname === '/fruits' || 
    location.pathname === '/natural-foods' || 
    location.pathname === '/nutritions' ||
    location.pathname === '/learn-more' ||
    location.pathname === '/explore-farm';

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Premium 3D Canvas Background */}
      {isStorefront && <Scene3D theme={theme} />}

      {/* Global Header */}
      {isStorefront && (
        <Header
          user={user}
          cartItems={cartItems}
          cartCount={cartCount}
          theme={theme}
          onAuthClick={() => setIsAuthOpen(true)}
          onShopClick={() => setIsShopOpen(true)}
          onContactClick={() => setIsContactOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
          onSearchClick={() => setIsSearchOpen(true)}
          onLogout={handleLogout}
          onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onUpdateCartItem={handleUpdateCartItem}
          onRemoveCartItem={handleRemoveCartItem}
        />
      )}

      {/* Main Pages */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage onShopClick={handleCheckoutClick} onAddToCart={handleAddToCart} authToken={token} user={user} onAuthClick={() => setIsAuthOpen(true)} />} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} cartCount={cartCount} onUpdateCartItem={handleUpdateCartItem} onRemoveCartItem={handleRemoveCartItem} onShopClick={handleCheckoutClick} />} />
          <Route path="/fruits" element={<Fruits onAddToCart={handleAddToCart} authToken={token} />} />
          <Route path="/natural-foods" element={<Navigate to="/#natural-foods" replace />} />
          <Route path="/nutritions" element={<Navigate to="/#nutritions" replace />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/explore-farm" element={<ExploreFarm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Footer */}
      {isStorefront && <Footer onContactClick={() => setIsContactOpen(true)} onSustainabilityClick={() => setIsSustainabilityOpen(true)} />}

      {/* Premium Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        cartItems={cartItems}
        cartCount={cartCount}
        onShopSuccess={handleShopSuccess}
        onUpdateCartItem={handleUpdateCartItem}
        onRemoveCartItem={handleRemoveCartItem}
        user={user}
        onAuthClick={() => {
          setIsShopOpen(false);
          setIsAuthOpen(true);
        }}
      />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        user={user}
        authToken={token}
        onAuthClick={() => {
          setIsContactOpen(false);
          setIsAuthOpen(true);
        }}
      />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        authToken={token}
        onLogout={handleLogout}
        onProfileUpdate={handleProfileUpdate}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <SustainabilityModal
        isOpen={isSustainabilityOpen}
        onClose={() => setIsSustainabilityOpen(false)}
      />

    </div>
  );
}
