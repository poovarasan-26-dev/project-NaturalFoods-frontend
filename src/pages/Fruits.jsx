import { useState, useEffect } from 'react';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '../lib/api';
import { resolveImage } from '../lib/utils';
import FruitCardModal from '../components/FruitCardModal';

const Fruits = ({ onAddToCart, authToken }) => {
  const navigate = useNavigate();
  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [backendProductMap, setBackendProductMap] = useState({});

  const mapBackendToFrontend = (products) => {
    const map = {};
    const fruitsList = [];
    let fid = 1;
    (products || []).forEach(p => {
      map[p.name.toLowerCase()] = p.id;
      const item = {
        id: fid,
        backendId: p.id,
        name: p.name,
        basePrice: Number(p.price),
        priceUnit: p.price_unit || 'kg',
        stock: p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Limited' : 'Out of Stock',
        image: p.image || null,
        icon: null,
        category: p.category,
      };
      if (p.category?.toLowerCase() === 'fruits') {
        fruitsList.push(item);
      }
      fid++;
    });
    return { map, fruitsList };
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiRequest('/api/dashboard/storefront/products/', { method: 'GET' })
      .then(products => {
        if (cancelled) return;
        const { map, fruitsList } = mapBackendToFrontend(products);
        setBackendProductMap(map);
        setFruits(fruitsList);
        setQuantities(Object.fromEntries(fruitsList.map(f => [f.id, 1])));
      })
      .catch(e => console.error('Fruits fetch error:', e))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [authToken]);

  const handleAddToCart = (item) => {
    onAddToCart(item);
  };

  return (
    <div className="fullscreen-page fruits-page" style={{ position: 'relative', minHeight: '100vh', paddingTop: '120px' }}>
      <div className="page-header" style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem' }}>
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowRight style={{ transform: 'rotate(180deg)' }} size={16} />
          <span>Back to Home</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Star className="text-primary" size={20} />
          <span className="text-sm font-black text-white/50 uppercase tracking-widest">Fresh Produce</span>
        </div>
      </div>

      <div className="section-container fruits-page-container">
        <div className="fruits-header">
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-xs">100% Organic</span>
            <h1 className="fruits-title">OUR FRESH FRUITS</h1>
            <p className="fruits-subtitle">Handpicked from the finest farms across India</p>
          </div>
          <div className="fruits-count-badge">
            <span>{fruits.length} varieties</span>
          </div>
        </div>

        <div className="fruit-cards-grid">
          <AnimatePresence>
            {fruits.map((fruit, idx) => {
              const qty = quantities[fruit.id] || 1;
              const total = fruit.basePrice * qty;

              return (
                <motion.div
                  key={fruit.id}
                  className={`fruit-card ${fruit.stock === 'Out of Stock' ? 'fruit-card-out' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  layout
                >
                  <div className="fruit-card-inner" onClick={() => setSelectedFruit(fruit)}>
                    <div className="fruit-card-top">
                      <span className="fruit-card-icon">{fruit.image ? <img src={resolveImage(fruit.image)} alt="" className="fruit-card-inline-img" /> : '🍎'}</span>
                    </div>
                    <h3 className="fruit-card-name">{fruit.name}</h3>
                    <div className="fruit-card-price-row">
                      <span className="fruit-card-price">₹{Math.round(total)}</span>
                      <span className="fruit-card-price-unit">{qty} kg × ₹{Math.round(fruit.basePrice)}/{fruit.priceUnit || 'kg'}</span>
                    </div>
                    <span className={`fruit-card-stock ${fruit.stock === 'In Stock' ? 'stock-in' : 'stock-out'}`}>
                      <span className="stock-dot"></span>
                      {fruit.stock}
                    </span>
                  </div>

                  {fruit.stock !== 'Out of Stock' && (
                    <div className="fruit-card-footer">
                      <div className="fruit-card-qty">
                        <div className="fruit-card-qty-stepper">
                          <button className="qty-step-btn" onClick={e => { e.stopPropagation(); setQuantities(prev => ({ ...prev, [fruit.id]: Math.max(0.5, (prev[fruit.id] || 1) - 0.5) })); }}>−</button>
                          <span className="qty-step-value">{qty >= 1 ? `${qty} kg` : `${qty * 1000}g`}</span>
                          <button className="qty-step-btn" onClick={e => { e.stopPropagation(); setQuantities(prev => ({ ...prev, [fruit.id]: Math.min(10, (prev[fruit.id] || 1) + 0.5) })); }}>+</button>
                        </div>
                      </div>
                      <button
                        className="fruit-card-shop"
                          onClick={e => {
                          e.stopPropagation();
                          onAddToCart({
                            id: fruit.id,
                            name: fruit.name,
                            icon: fruit.image ? null : '🍎',
                            image: resolveImage(fruit.image),
                            price: total,
                            qty: qty,
                            backendProductId: backendProductMap[fruit.name.toLowerCase()] || null
                          });
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

        {loading && (
          <div className="admin-loading" style={{ padding: '4rem 0' }}>
            <div className="admin-loading-spinner" />
            <p>Loading fruits...</p>
          </div>
        )}

        {!loading && fruits.length === 0 && (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="empty-icon">🍂</span>
            <p className="empty-text">No fruits available</p>
            <p className="empty-sub">All items have been removed</p>
          </motion.div>
        )}
      </div>

      <FruitCardModal
        isOpen={!!selectedFruit}
        onClose={() => setSelectedFruit(null)}
        fruit={selectedFruit}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Fruits;
