import { useEffect, useState } from 'react';
import { ArrowRight, Leaf, ShoppingCart, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FruitCardModal from '../components/FruitCardModal';
import { fetchProducts } from '../lib/api';

const kgOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const iconByCategory = {
  Fruits: '🍎',
  Vegetables: '🥦',
  Dairy: '🥛',
  Grains: '🌾',
  Grocery: '🛒',
  Beverages: '🧃',
};

const buildItem = (product) => ({
  id: product.id,
  name: product.name,
  type: product.category,
  origin: 'Natural Foods Farm',
  basePrice: Number(product.price),
  stock: product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Limited' : 'Out of Stock',
  availableUnits: product.stock,
  icon: iconByCategory[product.category] || '🌿',
});

const NaturalFoods = ({ onAddToCart, user, authToken, onAuthClick }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!authToken) {
      setItems([]);
      return;
    }

    let cancelled = false;
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError('');
        const products = await fetchProducts(authToken);
        if (cancelled) {
          return;
        }
        const mapped = products.map(buildItem);
        setItems(mapped);
        setQuantities(Object.fromEntries(mapped.map((item) => [item.id, 1])));
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load products from backend.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [authToken]);

  const addBackendItemToCart = (item, qty) => {
    onAddToCart({
      id: `backend-${item.id}`,
      backendProductId: item.id,
      name: item.name,
      icon: item.icon,
      price: item.basePrice * qty,
      qty,
      unitPrice: item.basePrice,
    });
  };

  return (
    <div className="fullscreen-page fruits-page" style={{ position: 'relative', minHeight: '100vh', paddingTop: '120px' }}>
      <div className="page-header" style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem' }}>
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowRight style={{ transform: 'rotate(180deg)' }} size={16} />
          <span>Back to Home</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Leaf className="text-primary" size={20} />
          <span className="text-sm font-black text-white/50 uppercase tracking-widest">Pure & Natural</span>
        </div>
      </div>

      <div className="section-container fruits-page-container">
        <div className="fruits-header">
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Backend Connected</span>
            <h1 className="fruits-title">NATURAL FOODS</h1>
            <p className="fruits-subtitle">Products loaded from backend and ready for admin-tracked orders</p>
          </div>
          <div className="fruits-count-badge">
            <span>{items.length} products</span>
          </div>
        </div>

        {!authToken ? (
          <div className="page-card-dark" style={{ maxWidth: '680px', margin: '2rem auto 0', textAlign: 'center', padding: '3rem' }}>
            <AlertCircle size={48} className="text-primary" style={{ margin: '0 auto 1rem' }} />
            <h3 className="text-2xl font-black text-white">LOGIN TO LOAD BACKEND PRODUCTS</h3>
            <p className="text-text-muted mt-3">Sign in first so product views, orders, leads, and messages all sync into the backend dashboard.</p>
            <button className="btn-premium-primary" style={{ marginTop: '1.5rem', padding: '1rem 1.75rem', borderRadius: '18px' }} onClick={onAuthClick}>
              <span>{user ? 'OPEN ACCOUNT' : 'SIGN IN NOW'}</span>
            </button>
          </div>
        ) : isLoading ? (
          <div className="page-card-dark" style={{ maxWidth: '680px', margin: '2rem auto 0', textAlign: 'center', padding: '3rem' }}>
            <p className="text-white font-black text-xl">Loading products from backend...</p>
          </div>
        ) : error ? (
          <div className="page-card-dark" style={{ maxWidth: '680px', margin: '2rem auto 0', textAlign: 'center', padding: '3rem' }}>
            <AlertCircle size={48} className="text-primary" style={{ margin: '0 auto 1rem' }} />
            <p className="text-white font-black text-xl">{error}</p>
          </div>
        ) : (
          <div className="fruit-cards-grid">
            <AnimatePresence>
              {items.map((item, idx) => {
                const qty = quantities[item.id] || 1;
                const total = item.basePrice * qty;

                return (
                  <motion.div
                    key={item.id}
                    className={`fruit-card ${item.stock === 'Out of Stock' ? 'fruit-card-out' : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    layout
                  >
                    <div className="fruit-card-inner" onClick={() => setSelectedItem(item)}>
                      <div className="fruit-card-top">
                        <span className="fruit-card-icon">{item.icon}</span>
                      </div>
                      <h3 className="fruit-card-name">{item.name}</h3>
                      <div className="fruit-card-meta">
                        <span className="fruit-card-meta-label">{item.type}</span>
                        <span className="fruit-card-meta-dot">·</span>
                        <span className="fruit-card-meta-label">{item.origin}</span>
                      </div>
                      <div className="fruit-card-price-row">
                        <span className="fruit-card-price">₹{Math.round(total)}</span>
                        <span className="fruit-card-price-unit">{qty} kg × ₹{Math.round(item.basePrice)}/kg</span>
                      </div>
                      <span className={`fruit-card-stock ${item.stock === 'In Stock' ? 'stock-in' : item.stock === 'Limited' ? 'stock-limited' : 'stock-out'}`}>
                        <span className="stock-dot"></span>
                        {item.stock}
                      </span>
                    </div>

                    {item.stock !== 'Out of Stock' && (
                      <div className="fruit-card-footer">
                        <div className="fruit-card-qty">
                          <select
                            className="fruit-card-qty-select"
                            value={qty}
                            onChange={e => setQuantities(prev => ({ ...prev, [item.id]: Number(e.target.value) }))}
                            onClick={e => e.stopPropagation()}
                          >
                            {kgOptions.map(k => (
                              <option key={k} value={k}>{k} kg</option>
                            ))}
                          </select>
                        </div>
                        <button
                          className="fruit-card-shop"
                          onClick={e => {
                            e.stopPropagation();
                            addBackendItemToCart(item, qty);
                          }}
                          title="Add Item"
                        >
                          <ShoppingCart size={14} />
                          <span>Add Item</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <FruitCardModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        fruit={selectedItem}
        onAddToCart={(data) => {
          addBackendItemToCart(selectedItem, data.qty);
          setSelectedItem(null);
        }}
      />
    </div>
  );
};

export default NaturalFoods;
