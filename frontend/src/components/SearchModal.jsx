import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

function resolveImage(src) {
  if (!src) return null;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return `${API_BASE}${src.startsWith('/') ? src : `/${src}`}`;
}

const iconByCategory = {
  Fruits: '🍎',
  Vegetables: '🥦',
  Dairy: '🥛',
  Grains: '🌾',
  Grocery: '🛒',
  Beverages: '🧃',
};

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoading(true);
    fetch('/api/dashboard/storefront/products/?_=' + Date.now())
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (!cancelled) {
          setProducts(data?.length ? data : []);
        }
      })
      .catch(() => { if (!cancelled) setProducts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isOpen]);

  const results = query.trim()
    ? products.filter(p =>
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleShopNow = (item) => {
    onClose();
    const cat = (item.category || '').toLowerCase();
    const section = cat === 'fruits' ? 'section-fruits' : cat === 'vegetables' ? 'section-vegetables' : 'section-nutritions';
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="search-header">
            <button onClick={onClose} className="search-back-btn">
              <ArrowLeft size={20} />
            </button>
            <div className="search-input-group">
              <Search size={18} className="search-input-icon" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                className="search-input"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button className="search-clear-btn" onClick={() => setQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="search-results">
            {loading && products.length === 0 && (
              <div className="search-empty">
                <div className="admin-loading-spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
                <p>Loading products...</p>
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="search-empty">
                <Search size={40} style={{ opacity: 0.2 }} />
                <p>No products found for "{query}"</p>
              </div>
            )}

            {!loading && !query && products.length === 0 && (
              <div className="search-empty">
                <Search size={40} style={{ opacity: 0.2 }} />
                <p>Start typing to search products</p>
              </div>
            )}

            {results.map((item, i) => {
              const priceVal = typeof item.price === 'number' ? item.price : parseFloat(item.price);
              const stockNum = typeof item.stock === 'number' ? item.stock : parseInt(item.stock, 10);
              const stockText = isNaN(stockNum) ? (item.stock || 'In Stock') : stockNum > 10 ? 'In Stock' : stockNum > 0 ? 'Limited' : 'Out of Stock';
              const stockClass = stockText === 'In Stock' ? 'stock-green' : 'stock-amber';
              const imageUrl = resolveImage(item.image);
              const displayIcon = imageUrl ? null : (iconByCategory[item.category] || '🛒');

              return (
                <motion.div
                  key={item.id || i}
                  className="search-result-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="search-result-icon-wrap">
                    {imageUrl ? (
                      <img src={imageUrl} alt="" className="search-result-img" />
                    ) : (
                      <span className="search-result-icon">{displayIcon}</span>
                    )}
                  </div>
                  <div className="search-result-info">
                    <h4 className="search-result-name">{item.name}</h4>
                    <span className="search-result-cat">{item.category}</span>
                    <span className={`search-result-stock ${stockClass}`}>{stockText}</span>
                  </div>
                  <div className="search-result-right">
                    <span className="search-result-price">₹{priceVal != null ? Math.round(priceVal) : ''}/{item.price_unit || 'kg'}</span>
                    <button className="search-shop-btn" onClick={() => handleShopNow(item)}>
                      <ShoppingBag size={14} />
                      <span>Shop Now</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
