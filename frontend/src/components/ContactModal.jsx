import React, { useEffect, useState } from 'react';
import { Mail, Phone, MessageSquare, CheckCircle2, ArrowLeft, ArrowRight, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchStorefrontSummary, sendMessage } from '../lib/api';

const ContactModal = ({ isOpen, onClose, user, authToken, onAuthClick }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [adminEmail, setAdminEmail] = useState('varasanpoo831@gmail.com');
  const [showHours, setShowHours] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: user?.username || '',
      email: user?.email || '',
    }));
  }, [user]);

  useEffect(() => {
    if (!isOpen || !authToken) return;
    let cancelled = false;
    setError('');
    fetchStorefrontSummary(authToken)
      .then((data) => {
        if (!cancelled && data.admin_contact?.email) setAdminEmail(data.admin_contact.email);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [isOpen, authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !authToken) {
      onClose();
      onAuthClick();
      return;
    }
    if (!adminEmail) {
      setError('Admin contact is not available right now.');
      return;
    }
    try {
      setError('');
      await sendMessage(authToken, {
        recipient_email: adminEmail,
        subject: `Frontend Contact: ${formData.name}`,
        body: `Phone: ${formData.phone}\nEmail: ${formData.email}\n\n${formData.message}`,
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: user?.username || '', email: user?.email || '', phone: '', message: '' });
        onClose();
      }, 2200);
    } catch (err) {
      setError(err.message || 'Unable to send your message right now.');
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
              <Mail className="text-primary" size={20} />
              <span className="text-sm font-black text-white/50 uppercase tracking-widest">Connect</span>
            </div>
          </div>

          <div className="page-content-wrapper">
            <div className="page-card-dark" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: '3rem' }}>
                <span className="text-primary font-bold uppercase tracking-widest text-xs">Reach Out</span>
                <h2 className="text-5xl font-black text-white mt-1">LET'S START A CONVERSATION</h2>
                <p className="text-text-muted mt-3 text-sm leading-relaxed">
                  Send us a message and our team will get back to you.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="icon-btn" style={{ width: '48px', height: '48px', cursor: 'default' }}>
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Our Location</h4>
                    <p className="text-white font-bold text-sm mt-1">Erospark Technologies Pvt Ltd, Erode</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="icon-btn" style={{ width: '48px', height: '48px', cursor: 'default' }}>
                    <Phone className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Phone Number</h4>
                    <p className="text-white font-bold text-sm mt-1">+91 9361249860</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="icon-btn" style={{ width: '48px', height: '48px', cursor: 'default' }}>
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Email</h4>
                    <p className="text-white font-bold text-sm mt-1">varasanpoo831@gmail.com</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="icon-btn" onClick={() => setShowHours(!showHours)} style={{ width: '48px', height: '48px', cursor: 'pointer' }}>
                    <Clock className="text-primary" size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Support Hours</h4>
                    <p className="text-white font-bold text-sm mt-1" style={{ cursor: 'pointer' }} onClick={() => setShowHours(!showHours)}>
                      {showHours ? 'Hide Details' : 'Click to view hours'}
                    </p>
                    {showHours && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ overflow: 'hidden', marginTop: '0.5rem' }}
                      >
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                          <div>Monday - Saturday: 9:30 AM - 6:00 PM</div>
                          <div style={{ color: '#ff7675', fontWeight: 700 }}>Sunday: Leave</div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="page-card-dark" style={{ position: 'relative' }}>
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center gap-6 py-20 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                  >
                    <CheckCircle2 size={88} className="text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2 uppercase">MESSAGE SENT!</h3>
                    <p className="text-text-muted text-sm">Your message has been submitted. We'll get back to you soon.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '2rem' }}>
                    <span className="text-primary font-bold uppercase tracking-widest text-xs">Direct Support</span>
                    <h2 className="text-4xl font-black text-white mt-1">SEND MESSAGE</h2>
                    <p className="text-text-muted mt-2 text-sm">Fill in your details and we'll respond promptly.</p>
                  </div>

                  {error && (
                    <div className="auth-error" style={{ marginBottom: '1rem' }}>
                      <span>{error}</span>
                    </div>
                  )}

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="premium-input-group">
                      <input required type="text" placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="premium-input"
                      />
                    </div>
                    <div className="premium-input-group">
                      <input required type="email" placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="premium-input"
                      />
                    </div>
                    <div className="premium-input-group">
                      <input required type="tel" placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="premium-input"
                      />
                    </div>
                    <div className="premium-input-group">
                      <textarea required rows="4" placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="premium-input"
                        style={{ resize: 'none', height: '120px' }}
                      />
                      <MessageSquare className="premium-input-icon" size={18} style={{ top: '1.5rem', transform: 'none' }} />
                    </div>
                    <button type="submit" className="w-full btn-premium-primary" style={{ padding: '1.25rem 2rem', borderRadius: '18px' }}>
                      <span>{user ? 'SUBMIT INQUIRY' : 'SIGN IN TO MESSAGE'}</span>
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

export default ContactModal;
