import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, Save, Image } from 'lucide-react';
import { resolveImage } from '../lib/utils';

const ProductEditModal = ({ isOpen, onClose, product, onSave, onDelete }) => {
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [stock, setStock] = useState('In Stock');
  const [imagePreview, setImagePreview] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef(null);

  const isAddMode = product && product.id == null;

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setBasePrice(product.basePrice || 0);
      setStock(product.stock || 'In Stock');
      setImagePreview(resolveImage(product.image) || null);
      setConfirmDelete(false);
    }
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      ...product,
      name: name.trim(),
      basePrice: Number(basePrice),
      stock,
      image: imagePreview || product?.image || null,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(product.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          className="edit-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="edit-modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="edit-modal-header">
              <h2 className="edit-modal-title">{isAddMode ? 'Add Product' : 'Edit Product'}</h2>
              <button className="edit-modal-close" onClick={onClose}><X size={18} /></button>
            </div>

            <div className="edit-modal-body">
              <div className="edit-image-section">
                <div className="edit-image-upload" onClick={() => fileInputRef.current?.click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="edit-image-preview" />
                  ) : (
                    <div className="edit-image-placeholder">
                      <Image size={36} />
                      <span>Upload Image</span>
                    </div>
                  )}
                  <div className="edit-image-overlay">
                    <Upload size={20} />
                    <span>Change</span>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} hidden />
                </div>
              </div>

              <div className="edit-form-fields">
                <div className="edit-field">
                  <label>Product Name</label>
                  <input
                    className="edit-modal-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter product name"
                    autoFocus
                  />
                </div>
                <div className="edit-field">
                  <label>Price (₹/kg)</label>
                  <input
                    className="edit-modal-input"
                    type="number"
                    value={basePrice}
                    onChange={e => setBasePrice(e.target.value)}
                    placeholder="Enter price"
                  />
                </div>
                <div className="edit-field">
                  <label>Stock Status</label>
                  <select className="edit-modal-select" value={stock} onChange={e => setStock(e.target.value)}>
                    <option value="In Stock">In Stock</option>
                    <option value="Limited">Limited</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="edit-modal-footer">
              {isAddMode ? (
                <button className="btn-save-modal" onClick={handleSave}>
                  <Save size={15} /> Add Product
                </button>
              ) : confirmDelete ? (
                <div className="edit-delete-confirm">
                  <span>Delete this product?</span>
                  <div className="edit-delete-confirm-actions">
                    <button className="btn-delete-yes" onClick={handleDelete}>Yes, Delete</button>
                    <button className="btn-delete-no" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <button className="btn-delete" onClick={() => setConfirmDelete(true)}>
                    <Trash2 size={15} /> Delete
                  </button>
                  <button className="btn-save-modal" onClick={handleSave}>
                    <Save size={15} /> Save Changes
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductEditModal;
