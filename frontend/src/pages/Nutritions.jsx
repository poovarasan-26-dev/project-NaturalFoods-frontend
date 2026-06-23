import { useState } from 'react';
import { ArrowRight, Activity, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FruitCardModal from '../components/FruitCardModal';

const kgOptions = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const initialData = [
  { id: 1, name: 'Whey Protein', brand: 'Natural Farms', serving: '30g', basePrice: 1200, stock: 'In Stock', icon: '💪' },
  { id: 2, name: 'Organic Spirulina', brand: 'Green Earth', serving: '10g', basePrice: 800, stock: 'In Stock', icon: '🌿' },
  { id: 3, name: 'Moringa Powder', brand: 'Pure Nutrition', serving: '15g', basePrice: 350, stock: 'In Stock', icon: '🍃' },
  { id: 4, name: 'Vitamin C Complex', brand: 'Natural Boost', serving: '1000mg', basePrice: 600, stock: 'Limited', icon: '🍊' },
  { id: 5, name: 'Omega 3 Capsules', brand: 'Fish Oil Pure', serving: '1000mg', basePrice: 750, stock: 'In Stock', icon: '🐟' },
  { id: 6, name: 'Plant Protein', brand: 'Vegan Fit', serving: '35g', basePrice: 1500, stock: 'In Stock', icon: '🌱' },
  { id: 7, name: 'Probiotic Complex', brand: 'Gut Health', serving: '10B CFU', basePrice: 900, stock: 'In Stock', icon: '🦠' },
  { id: 8, name: 'Organic Ashwagandha', brand: 'Ayur Pure', serving: '500mg', basePrice: 450, stock: 'In Stock', icon: '🌿' },
];

const Nutritions = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [items] = useState(initialData);
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(initialData.map(f => [f.id, 1]))
  );
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="fullscreen-page fruits-page" style={{ position: 'relative', minHeight: '100vh', paddingTop: '120px' }}>
      <div className="page-header" style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem' }}>
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowRight style={{ transform: 'rotate(180deg)' }} size={16} />
          <span>Back to Home</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity className="text-primary" size={20} />
          <span className="text-sm font-black text-white/50 uppercase tracking-widest">Health & Wellness</span>
        </div>
      </div>

      <div className="section-container fruits-page-container">
        <div className="fruits-header">
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Premium Grade</span>
            <h1 className="fruits-title">NUTRITIONS</h1>
            <p className="fruits-subtitle">Essential nutrients for a healthier you</p>
          </div>
          <div className="fruits-count-badge">
            <span>{items.length} varieties</span>
          </div>
        </div>

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
                      <span className="fruit-card-meta-label">{item.brand}</span>
                      <span className="fruit-card-meta-dot">·</span>
                      <span className="fruit-card-meta-label">{item.serving}</span>
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
                          onAddToCart({
                            id: item.id,
                            name: item.name,
                            icon: item.icon,
                            price: total,
                            qty: qty
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
      </div>

      <FruitCardModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        fruit={selectedItem}
        onAddToCart={(data) => {
          onAddToCart(data);
          setSelectedItem(null);
        }}
      />
    </div>
  );
};

export default Nutritions;
