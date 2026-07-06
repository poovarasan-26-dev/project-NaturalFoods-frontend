import { useState } from 'react';
import { User, Lock, Mail, Phone, MapPin, CheckCircle2, ArrowLeft, ArrowRight, Leaf, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loginUser, registerUser, setAuthSession } from '../lib/api';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    address: ''
  });
  const trimmedPassword = formData.password.trim();

  const resetForm = () => {
    setFormData({ username: '', password: '', email: '', phone: '', address: '' });
    setError('');
  };

  const completeAuth = (payload, extraUser = {}) => {
    const frontendUser = {
      ...(payload.user || {}),
      ...extraUser,
    };
    setAuthSession({
      access: payload.access,
      refresh: payload.refresh,
      user: frontendUser,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onLoginSuccess(frontendUser, payload.user?.redirect_to);
      resetForm();
      onClose();
    }, isLogin ? 2000 : 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);

      if (isLogin) {
        const payload = await loginUser({
          username: formData.username.trim(),
          password: trimmedPassword,
        });
        completeAuth(payload);
        return;
      }

      await registerUser({
        username: formData.username.trim(),
        password: trimmedPassword,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });

      const payload = await loginUser({
        email: formData.email.trim(),
        password: trimmedPassword,
      });
      completeAuth(payload, {
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });
    } catch (err) {
      setError(err.message || 'Unable to continue right now.');
    } finally {
      setIsSubmitting(false);
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
              <User className="text-primary" size={20} />
              <span className="text-sm font-black text-white/50 uppercase tracking-widest">Portal</span>
            </div>
          </div>

          <div className="page-content-wrapper auth-split">
            
            <div className="auth-hero-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', zIndex: 1 }}>
                <div className="nav-logo-icon">
                  <Leaf className="text-primary" size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">
                  NATURAL<span className="text-primary">FOODS</span>
                </span>
              </div>

              <div style={{ zIndex: 1 }}>
                <span className="text-primary font-bold uppercase tracking-widest text-xs">Join the Community</span>
                <h2 className="text-5xl font-black text-white mt-2 leading-tight">THE ORGANIC<br />REVOLUTION</h2>
                <p className="text-text-muted mt-4 text-sm leading-relaxed max-w-sm">
                  Become a member today to receive early notifications on limited harvests, earn farm loyalty tokens, and order customized seasonal baskets.
                </p>
              </div>

              <div style={{ marginTop: '4rem', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-relaxed">
                  🌿 100% PURE CERTIFIED ORGANIC WORLD
                </p>
              </div>
            </div>

            <div className="page-card-dark" style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {isSuccess ? (
                <motion.div
                  className="auth-success-body"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 10, stiffness: 120 }}
                    className="auth-success-icon"
                  >
                    <CheckCircle2 size={64} />
                  </motion.div>
                  <motion.h3
                    className="auth-success-title"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isLogin ? 'WELCOME BACK!' : 'REGISTERED!'}
                  </motion.h3>
                  <motion.p
                    className="auth-success-text"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    {isLogin 
                      ? 'Successfully logged in. Redirecting to shop...' 
                      : 'Account created! Logging you in...'}
                  </motion.p>
                </motion.div>
              ) : (
                <>
                  <div style={{ marginBottom: '2.5rem' }}>
                    <span className="text-primary font-bold uppercase tracking-widest text-xs">Account Portal</span>
                    <h2 className="text-4xl font-black text-white mt-1">
                      {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
                    </h2>
                    <p className="text-text-muted mt-2 text-sm">
                      {isLogin ? 'Enter your details below to access your account.' : 'Fill in the details to join us today.'}
                    </p>
                  </div>

                  <div className="auth-toggle-bar">
                      <button 
                      onClick={() => { setIsLogin(true); resetForm(); }}
                      className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
                    >
                      LOGIN
                    </button>
                    <button 
                      onClick={() => { setIsLogin(false); resetForm(); }}
                      className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
                    >
                      SIGN UP
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        className="auth-error"
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                      >
                        <AlertCircle size={14} />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin ? (
                      <>
                        <div className="premium-input-group">
                          <input 
                            required
                            type="text" 
                            placeholder="Username"
                            className="premium-input"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                          />
                          <User className="premium-input-icon" size={18} />
                        </div>
                        <div className="premium-input-group">
                          <input 
                            required
                            type="password" 
                            placeholder="Password"
                            className="premium-input"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                          />
                          <Lock className="premium-input-icon" size={18} />
                        </div>
                        <div className="premium-input-group">
                          <input 
                            required
                            type="tel" 
                            placeholder="Phone Number"
                            className="premium-input"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                          <Phone className="premium-input-icon" size={18} />
                        </div>
                        <div className="premium-input-group">
                          <input 
                            required
                            type="email" 
                            placeholder="Email Address"
                            className="premium-input"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                          <Mail className="premium-input-icon" size={18} />
                        </div>
                        <div className="premium-input-group">
                          <textarea 
                            required
                            placeholder="Delivery Address"
                            rows="2"
                            className="premium-input"
                            style={{ resize: 'none' }}
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                          ></textarea>
                          <MapPin className="premium-input-icon" size={18} style={{ top: '1.2rem', transform: 'none' }} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="premium-input-group">
                          <input 
                            required
                            type="text" 
                            placeholder="Username"
                            className="premium-input"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                          />
                          <User className="premium-input-icon" size={18} />
                        </div>
                        <div className="premium-input-group">
                          <input 
                            required
                            type="password" 
                            placeholder="Password"
                            className="premium-input"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                          />
                          <Lock className="premium-input-icon" size={18} />
                        </div>
                      </>
                    )}

                    <button 
                      type="submit"
                      className="w-full btn-premium-primary"
                      disabled={isSubmitting}
                      style={{ padding: '1.25rem 2rem', borderRadius: '18px' }}
                    >
                      <span>{isSubmitting ? 'PLEASE WAIT...' : isLogin ? 'SIGN IN' : 'REGISTER NOW'}</span>
                      <ArrowRight size={18} />
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
