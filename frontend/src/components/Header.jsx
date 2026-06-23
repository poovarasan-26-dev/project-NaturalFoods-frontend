import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Search, ShoppingCart, LogOut, Menu, X, Sun, Moon } from 'lucide-react';

const Header = ({ 
  onAuthClick, 
  onShopClick, 
  onContactClick,
  onProfileClick,
  onSearchClick,
  user,
  cartItems,
  cartCount,
  onLogout,
  theme,
  onThemeToggle,
  onUpdateCartItem,
  onRemoveCartItem
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', action: () => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, id: 'nav-home' },
    { label: 'About', action: () => { navigate('/'); setTimeout(() => document.getElementById('section-about')?.scrollIntoView({ behavior: 'smooth' }), 100); }, id: 'nav-about' },
    { label: 'Contact Us', action: () => { navigate('/'); setTimeout(() => document.getElementById('section-contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }, id: 'nav-contact' }
  ];

  return (
    <>
      <div className="nav-container static-position">
        <div className="nav-wrapper static-nav">
          
          <div 
            id="nav-logo"
            className="nav-logo"
            onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <img src="/images/dention.png" alt="Natural Foods" className="nav-logo-img" />
            <span className="nav-logo-text">
              NATURAL<span className="nav-logo-accent">FOODS</span>
            </span>
          </div>

          <nav className="nav-menu">
            {navItems.map((item) => (
              <button 
                key={item.label}
                id={item.id}
                onClick={() => item.action()}
                className={`nav-link ${location.pathname === '/' && item.label === 'Home' ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="nav-actions-desktop">
            <div className="nav-search-box">
              <Search size={16} className="nav-search-icon" />
              <input
                type="text"
                className="nav-search-input"
                placeholder="Search products..."
                onFocus={onSearchClick}
              />
            </div>

            <button 
              id="nav-theme-btn"
              className="icon-btn"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              onClick={onThemeToggle}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              id="nav-cart-btn"
              onClick={() => navigate('/cart')}
              className="icon-btn"
              title="Cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="user-profile" onClick={onProfileClick} style={{ cursor: 'pointer' }}>
                  <div className="user-avatar user-avatar-letter">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="username">{user.username}</span>
                </div>
                <button 
                  id="nav-logout-btn"
                  onClick={onLogout}
                  className="btn-logout"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                id="nav-login-btn"
                onClick={onAuthClick}
                className="btn-primary-nav"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="nav-actions-mobile">
            <div className="nav-search-box nav-search-box-mobile">
              <Search size={14} className="nav-search-icon" />
              <input
                type="text"
                className="nav-search-input"
                placeholder="Search..."
                onFocus={onSearchClick}
              />
            </div>

            <button 
              id="nav-cart-mobile"
              onClick={() => navigate('/cart')}
              className="icon-btn"
            >
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="cart-badge" style={{ width: '15px', height: '15px', fontSize: '8px' }}>
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              id="nav-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="icon-btn"
              style={{ background: isMobileMenuOpen ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255, 255, 255, 0.03)' }}
            >
              {isMobileMenuOpen ? <X size={18} className="nav-logo-accent" /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-overlay">
          <div className="mobile-menu-items">
            {[
              { label: 'Home', id: 'nav-home-mobile', delay: 0 },
              { label: 'About', id: 'nav-about-mobile', delay: 1, section: 'section-about' },
              { label: 'Contact Us', id: 'nav-contact-mobile', delay: 2, section: 'section-contact' },
            ].map((link) => (
              <button 
                key={link.label}
                id={link.id}
                onClick={() => {
                  navigate('/');
                  setIsMobileMenuOpen(false);
                  if (link.section) {
                    setTimeout(() => document.getElementById(link.section)?.scrollIntoView({ behavior: 'smooth' }), 150);
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="mobile-nav-link"
                style={{ animation: `fadeInUp 0.4s ease forwards ${link.delay * 0.05}s`, opacity: 0, fontSize: link.delay === 0 ? undefined : '1.3rem' }}
              >
                {link.label}
              </button>
            ))}

            <style dangerouslySetInnerHTML={{__html: `
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(15px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}} />

            <div style={{ width: '60px', height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '1rem 0' }}></div>

            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <div className="user-profile" style={{ padding: '0.5rem 1.25rem', cursor: 'pointer' }} onClick={() => { onProfileClick(); setIsMobileMenuOpen(false); }}>
                  <div className="user-avatar user-avatar-letter" style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="username" style={{ fontSize: '0.85rem' }}>{user.username}</span>
                </div>
                <button 
                  id="nav-logout-mobile"
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-logout"
                  style={{ width: 'auto', height: 'auto', padding: '0.6rem 1.5rem', borderRadius: '9999px', display: 'flex', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <button 
                id="nav-login-mobile"
                onClick={() => {
                  onAuthClick();
                  setIsMobileMenuOpen(false);
                }}
                className="btn-primary-nav"
                style={{ width: '100%', maxWidth: '200px', textAlign: 'center', padding: '0.8rem', marginTop: '1rem' }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
