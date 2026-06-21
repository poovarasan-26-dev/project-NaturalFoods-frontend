import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

const CartPage = ({ cartItems, cartCount, onUpdateCartItem, onRemoveCartItem, onShopClick }) => {
  const navigate = useNavigate();
  const itemsTotal = cartItems.reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="fullscreen-page" style={{ paddingTop: '120px' }}>
      <div className="page-header" style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem' }}>
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingCart className="text-primary" size={20} />
          <span className="text-sm font-black text-white/50 uppercase tracking-widest">Shopping Cart</span>
        </div>
      </div>

      <div className="section-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem', width: '100%' }}>
        <div className="cart-page-layout">
          <div className="cart-page-left">
            <h2 className="cart-page-title">Your Cart</h2>
            <p className="cart-page-subtitle">{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>

            {cartItems.length === 0 ? (
              <div className="cart-page-empty">
                <ShoppingCart size={48} className="cart-page-empty-icon" />
                <p>Your cart is empty</p>
                <button className="cart-page-shop-link" onClick={() => navigate('/')}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="cart-page-items">
                {cartItems.map((item) => {
                  const unitPrice = item.unitPrice || (item.price / item.qty);
                  return (
                    <div key={item.id} className="cart-page-item">
                      <span className="cart-page-item-icon">
                        {item.image ? <img src={item.image} alt="" className="cart-page-item-img" /> : item.icon}
                      </span>
                      <div className="cart-page-item-info">
                        <span className="cart-page-item-name">{item.name}</span>
                        <div className="cart-page-item-controls">
                          <button
                            className="cart-page-qty-btn"
                            onClick={() => {
                              if (item.qty <= 1) {
                                onRemoveCartItem(item.id);
                              } else {
                                onUpdateCartItem(item.id, item.qty - 1, (item.qty - 1) * unitPrice);
                              }
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="cart-page-qty-value">{item.qty}</span>
                          <button
                            className="cart-page-qty-btn"
                            onClick={() => onUpdateCartItem(item.id, item.qty + 1, (item.qty + 1) * unitPrice)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="cart-page-item-right">
                        <span className="cart-page-item-price">₹{Math.round(item.price)}</span>
                        <button className="cart-page-item-remove" onClick={() => onRemoveCartItem(item.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="cart-page-right">
              <div className="cart-page-summary-card">
                <h3 className="cart-summary-heading">Order Summary</h3>
                <div className="cart-summary-rows">
                  <div className="cart-summary-row">
                    <span>Total Items</span>
                    <span className="cart-summary-val">{cartCount}</span>
                  </div>
                  <div className="cart-summary-row cart-summary-total-row">
                    <span>Total</span>
                    <span className="cart-summary-price">₹{Math.round(itemsTotal)}</span>
                  </div>
                </div>
                <button className="cart-summary-checkout" onClick={onShopClick}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-page-bottom">
            <button className="cart-continue-btn" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
