import { useState } from 'react';
import { X, ShoppingCart, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const kgOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const FruitCardModal = ({ isOpen, onClose, fruit, onAddToCart }) => {
  const [qty, setQty] = useState(1);

  if (!fruit) return null;

  const total = fruit.basePrice * qty;

  const handleAdd = () => {
    onAddToCart({
      id: fruit.id,
      name: fruit.name,
      icon: fruit.icon,
      price: total,
      qty: qty
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fruit-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="fruit-modal-card"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="fruit-modal-close" onClick={onClose}>
              <X size={18} />
            </button>

            <div className="fruit-modal-glow"></div>

            <div className="fruit-modal-icon">
              <span>{fruit.icon}</span>
            </div>

            <div className="fruit-modal-body">
              <div className="fruit-modal-header">
                <span className="fruit-modal-badge">100% Organic</span>
                <h2 className="fruit-modal-title">{fruit.name}</h2>
                <p className="fruit-modal-base">
                  <span className="text-primary font-black">₹{Math.round(total)}</span>
                  <span className="text-text-muted"> ({qty} kg × ₹{Math.round(fruit.basePrice)}/kg)</span>
                </p>
              </div>

              <div className="fruit-modal-divider"></div>

              <div className="fruit-modal-qty-section">
                <div className="fruit-modal-qty-header">
                  <Leaf size={14} className="text-primary" />
                  <span className="fruit-modal-qty-label">Select Quantity</span>
                </div>
                <div className="fruit-modal-qty-grid">
                  {kgOptions.map(k => (
                    <button
                      key={k}
                      className={`fruit-modal-qty-btn ${qty === k ? 'active' : ''}`}
                      onClick={() => setQty(k)}
                    >
                      {k} kg
                    </button>
                  ))}
                </div>
              </div>

              <div className="fruit-modal-divider"></div>

              <div className="fruit-modal-total">
                <span className="fruit-modal-total-label">Total Price</span>
                <span className="fruit-modal-total-value">₹{Math.round(total)}</span>
              </div>

              <button
                className="fruit-modal-add-btn"
                onClick={handleAdd}
                disabled={fruit.stock === 'Out of Stock'}
              >
                <ShoppingCart size={16} />
                <span>{fruit.stock === 'Out of Stock' ? 'Out of Stock' : 'Add Item'}</span>
              </button>

              {fruit.stock !== 'Out of Stock' && (
                <p className="fruit-modal-stock">
                  <span className="stock-dot" style={{ background: 'var(--primary)', boxShadow: '0 0 6px rgba(46, 204, 113, 0.6)' }}></span>
                  In Stock
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FruitCardModal;
