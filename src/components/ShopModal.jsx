import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Banknote, ShoppingBag, CheckCircle2, ArrowRight, ArrowLeft, PartyPopper, Sparkles, User, Pencil, Trash2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getValidAccessToken, refreshAccessToken, placeStorefrontOrder, cancelStorefrontOrder, fetchProducts } from '../lib/api';
import { resolveImage } from '../lib/utils';

const ShopModal = ({ isOpen, onClose, cartItems, cartCount, onShopSuccess, onUpdateCartItem, onRemoveCartItem, user, onAuthClick }) => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [successType, setSuccessType] = useState('place');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState(1);
  const [editName, setEditName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.username || '',
    address: '',
    cardDetails: ''
  });

  const displayCartCount = cartCount || 0;
  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const finalPrice = Math.round(itemsTotal);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditQty(item.qty);
    setEditName(item.name);
  };

  const saveEdit = (item) => {
    const qty = Number(editQty) || 1;
    const newPrice = (item.price / item.qty) * qty;
    onUpdateCartItem(item.id, qty, newPrice, editName);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onAuthClick();
      return;
    }
    if (cartItems.length === 0) {
      setSubmitError('Add at least one backend product to place an order.');
      return;
    }

    let token = await getValidAccessToken();
    if (!token) {
      onAuthClick();
      return;
    }

    const doOrder = async (t) => {
      const productMap = {};
      for (const item of cartItems) {
        if (!item.backendProductId) {
          if (Object.keys(productMap).length === 0) {
            const products = await fetchProducts(t);
            products.forEach(p => { productMap[p.name.toLowerCase()] = p.id; });
          }
          item.backendProductId = productMap[item.name.toLowerCase()] || null;
        }
        if (!item.backendProductId) {
          throw new Error(`"${item.name}" not found in backend. Contact admin.`);
        }
        await placeStorefrontOrder(t, {
          product_id: item.backendProductId,
          quantity: Math.round(item.qty),
        });
      }
    };

    try {
      setIsSubmitting(true);
      setSubmitError('');
      await doOrder(token);
      setIsSuccess(true);
      setSuccessType('place');
      setTimeout(() => {
        setIsSuccess(false);
        onShopSuccess();
        onClose();
        navigate('/');
      }, 2000);
    } catch (error) {
      // If auth error, try refreshing token once and retry
      if (error.message?.includes('token') || error.response?.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          try {
            token = refreshed;
            setSubmitError('');
            await doOrder(token);
            setIsSuccess(true);
            setTimeout(() => {
              setIsSuccess(false);
              onShopSuccess();
              onClose();
              navigate('/');
            }, 2000);
            return;
          } catch (retryErr) {
            setSubmitError(retryErr.message || 'Order failed after token refresh.');
            return;
          }
        }
      }
      setSubmitError(error.message || 'Unable to place order right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    if (!user) {
      onAuthClick();
      return;
    }
    if (cartItems.length === 0) {
      setSubmitError('Add at least one backend product to cancel an order.');
      return;
    }

    let token = await getValidAccessToken();
    if (!token) {
      onAuthClick();
      return;
    }

    const doCancel = async (t) => {
      const productMap = {};
      for (const item of cartItems) {
        if (!item.backendProductId) {
          if (Object.keys(productMap).length === 0) {
            const products = await fetchProducts(t);
            products.forEach(p => { productMap[p.name.toLowerCase()] = p.id; });
          }
          item.backendProductId = productMap[item.name.toLowerCase()] || null;
        }
        if (!item.backendProductId) {
          throw new Error(`"${item.name}" not found in backend. Contact admin.`);
        }
        await cancelStorefrontOrder(t, {
          product_id: item.backendProductId,
          quantity: Math.round(item.qty),
        });
      }
    };

    try {
      setIsCancelling(true);
      setSubmitError('');
      await doCancel(token);
      setIsSuccess(true);
      setSuccessType('cancel');
      setTimeout(() => {
        setIsSuccess(false);
        onShopSuccess();
        onClose();
        navigate('/');
      }, 2000);
    } catch (error) {
      if (error.message?.includes('token') || error.response?.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          try {
            token = refreshed;
            setSubmitError('');
            await doCancel(token);
            setIsSuccess(true);
            setTimeout(() => {
              setIsSuccess(false);
              onShopSuccess();
              onClose();
              navigate('/');
            }, 2000);
            return;
          } catch (retryErr) {
            setSubmitError(retryErr.message || 'Cancel failed after token refresh.');
            return;
          }
        }
      }
      setSubmitError(error.message || 'Unable to cancel order right now.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fullscreen-page"
        >
          <div className="page-header">
            <button onClick={onClose} className="back-btn">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag className="text-primary" size={20} />
              <span className="text-sm font-black text-white/50 uppercase tracking-widest">Organic Shop</span>
            </div>
          </div>

          <div className="page-content-wrapper" style={{ position: 'relative', zIndex: 1 }}>
            
            <div className="page-card-dark" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '2rem' }}>
                <span className="text-primary font-bold uppercase tracking-widest text-xs">Your Selection</span>
                <h2 className="text-4xl font-black text-white mt-1">ORGANIC HARVEST BAG</h2>
                <p className="text-text-muted mt-2 text-sm">Freshly gathered and packed from sustainable farms</p>
              </div>

              {user && (
                <div className="shop-user-badge">
                  <div className="shop-user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="shop-user-name">{user.username}</div>
                    <div className="shop-user-label">Customer</div>
                  </div>
                </div>
              )}

              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.5 }}>
                  <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p style={{ fontWeight: 700 }}>Your cart is empty</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.3rem', color: 'var(--text-muted)' }}>Add items from the catalog</p>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item-card">
                      {item.image ? (
                        <img src={resolveImage(item.image)} alt={item.name} className="cart-item-img" />
                      ) : (
                        <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                      )}
                      <div className="cart-item-info">
                        {editingId === item.id ? (
                          <input
                            className="edit-input"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            style={{ marginBottom: '0.25rem' }}
                          />
                        ) : (
                          <h4 className="cart-item-title">{item.name}</h4>
                        )}
                        <p className="cart-item-price">₹{Math.round(item.price)}</p>
                      </div>

                      {editingId === item.id ? (
                        <div className="cart-item-edit-qty">
                          <input
                            className="edit-input"
                            type="text"
                            value={editQty}
                            onChange={e => {
                              const val = e.target.value;
                              if (/^\d*\.?\d*$/.test(val)) setEditQty(val);
                            }}
                            style={{ width: '70px', textAlign: 'center' }}
                          />
                          <button className="cart-item-icon-btn cart-item-icon-save" onClick={() => saveEdit(item)} title="Save">
                            <Check size={14} />
                          </button>
                          <button className="cart-item-icon-btn cart-item-icon-cancel" onClick={cancelEdit} title="Cancel">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="cart-item-actions">
                          <div style={{ textAlign: 'right' }}>
                            <span className="text-xs font-bold text-white/40 block">QTY</span>
                            <span className="text-sm font-black text-white">{item.qty} kg</span>
                          </div>
                          <button className="cart-item-icon-btn" onClick={() => startEdit(item)} title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button className="cart-item-icon-btn cart-item-icon-del" onClick={() => onRemoveCartItem(item.id)} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  <span className="text-text-muted">Subtotal ({displayCartCount} items)</span>
                  <span className="text-white font-bold">₹{finalPrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                  <span className="text-text-muted">Delivery</span>
                  <span className="text-primary font-bold">FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                  <span className="text-lg text-white font-bold">Order Total</span>
                  <span className="text-3xl text-primary font-black">₹{finalPrice}</span>
                </div>
              </div>
            </div>

            <div className="page-card-dark" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ marginBottom: '2rem' }}>
                <span className="text-primary font-bold uppercase tracking-widest text-xs">Payment & Dispatch</span>
                <h2 className="text-4xl font-black text-white mt-1">CHECKOUT</h2>
                <p className="text-text-muted mt-2 text-sm">Complete your delivery and payment details to order.</p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {submitError && (
                  <div className="auth-error" style={{ marginBottom: '0' }}>
                    <span>{submitError}</span>
                  </div>
                )}
                
                <div className="premium-input-group">
                  <input 
                    required
                    type="text" 
                    placeholder="Full Name"
                    className="premium-input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <User className="premium-input-icon" size={18} />
                </div>

                <div className="premium-input-group">
                  <textarea 
                    required
                    placeholder="Delivery Address"
                    rows="3"
                    className="premium-input"
                    style={{ resize: 'none', height: '100px' }}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  ></textarea>
                  <MapPin className="premium-input-icon" size={18} style={{ top: '1.5rem', transform: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Payment Method</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`payment-option-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    >
                      <CreditCard size={18} />
                      <span>Credit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`payment-option-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                    >
                      <Banknote size={18} />
                      <span>Cash on Delivery</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="premium-input-group"
                  >
                    <input 
                      required
                      type="text" 
                      placeholder="Card Number (MM/YY CVC)"
                      className="premium-input"
                      value={formData.cardDetails}
                      onChange={(e) => setFormData({...formData, cardDetails: e.target.value})}
                    />
                    <CreditCard className="premium-input-icon" size={18} />
                  </motion.div>
                )}

                <button 
                  type="submit"
                  className="w-full btn-premium-primary"
                  disabled={isSubmitting}
                  style={{ padding: '1.25rem 2rem', borderRadius: '18px' }}
                >
                  <span>{isSubmitting ? 'PLACING ORDER...' : 'PLACE ORDER'}</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="w-full"
                  style={{
                    padding: '1rem 2rem',
                    borderRadius: '18px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.08)',
                    color: '#ef4444',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    opacity: isCancelling ? 0.6 : 1,
                  }}
                  onMouseOver={e => { if (!isCancelling) { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)'; }}}
                  onMouseOut={e => { if (!isCancelling) { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'; }}}
                >
                  <span>{isCancelling ? 'CANCELLING...' : 'CANCEL ORDER'}</span>
                  <X size={16} />
                </button>
              </form>
            </div>

          </div>

          {/* Success Popup - Full screen centered overlay */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                className="success-popup-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="success-popup-card"
                  initial={{ opacity: 0, scale: 0.5, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ type: "spring", damping: 15, stiffness: 100 }}
                >
                  <div className="success-popup-glow"></div>
                  
                  <motion.div
                    className="success-popup-icon"
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 8, stiffness: 120, delay: 0.1 }}
                  >
                    <CheckCircle2 size={56} />
                  </motion.div>

                  <motion.div
                    className="success-popup-sparkles"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Sparkles size={20} />
                    <Sparkles size={14} />
                    <Sparkles size={18} />
                  </motion.div>

                  <motion.h3
                    className="success-popup-title"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    {successType === 'cancel' ? 'ORDER CANCELLED' : 'ORDER PLACED'}
                  </motion.h3>

                  <motion.p
                    className="success-popup-text"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    {successType === 'cancel' ? 'Your order has been cancelled.' : 'Your order placed successfully.'}
                  </motion.p>

                  <motion.div
                    className="success-popup-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="success-popup-confetti">
                      <PartyPopper size={18} />
                      <PartyPopper size={14} />
                      <PartyPopper size={20} />
                    </div>
                    <span className="success-popup-redirect">Preparing your delivery...</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShopModal;
