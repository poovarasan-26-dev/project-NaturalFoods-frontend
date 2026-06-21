import { useState, useEffect } from 'react';
import { User, Mail, Phone, ArrowLeft, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileModal = ({ isOpen, onClose, user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({ username: '', email: '', phone: '' });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await onProfileUpdate(formData);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1500);
    } catch (err) {
      // error already alerted in parent
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="profile-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="profile-card"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", damping: 18, stiffness: 100 }}
          >
            <button className="profile-close" onClick={onClose}>
              <ArrowLeft size={18} />
            </button>

            {isSaved ? (
              <div className="profile-saved">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <CheckCircle2 size={56} className="text-primary" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="profile-saved-title"
                >
                  PROFILE UPDATED!
                </motion.h3>
              </div>
            ) : (
              <>
                <div className="profile-header">
                  <div className="profile-avatar-large">
                    {user?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <h2 className="profile-name">{user?.username || 'User'}</h2>
                  <p className="profile-sub">Manage your account details</p>
                </div>

                <form onSubmit={handleSave} className="profile-form">
                  <div className="profile-input-group">
                    <User size={16} className="profile-input-icon" />
                    <input
                      required
                      type="text"
                      placeholder="Username"
                      className="profile-input"
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  <div className="profile-input-group">
                    <Mail size={16} className="profile-input-icon" />
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      className="profile-input"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="profile-input-group">
                    <Phone size={16} className="profile-input-icon" />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      className="profile-input"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <button type="submit" className="profile-save-btn">
                    <Save size={16} />
                    <span>SAVE CHANGES</span>
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
