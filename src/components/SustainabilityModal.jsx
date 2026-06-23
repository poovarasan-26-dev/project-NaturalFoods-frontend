import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Leaf, Recycle, TreePine, Wind, Droplets, Sun } from 'lucide-react';

const SustainabilityModal = ({ isOpen, onClose }) => {
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
              <Leaf className="text-primary" size={20} />
              <span className="text-sm font-black text-white/50 uppercase tracking-widest">Sustainability</span>
            </div>
          </div>

          <div className="page-content-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-card-dark" style={{ padding: '3rem', borderRadius: '32px' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[3px] w-14 bg-primary rounded-full"></div>
                <span className="text-primary font-bold tracking-[0.15em] uppercase text-xs">Our Commitment</span>
              </div>
              <h2 className="text-4xl font-black text-white mb-4">SUSTAINABILITY</h2>
              <p className="text-text-muted leading-relaxed mb-12" style={{ fontSize: '1.05rem' }}>
                We are committed to sustainable farming practices that protect our planet 
                while delivering the highest quality organic products to your table.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.12)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(46,204,113,0.12)' }}>
                    <TreePine className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Eco-Friendly Farming</h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      We use natural pest control, crop rotation, and organic composting to maintain soil health 
                      and biodiversity without harmful chemicals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.12)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(46,204,113,0.12)' }}>
                    <Recycle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Plastic-Free Packaging</h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      All our packaging is made from recycled and biodegradable materials. 
                      We aim for zero plastic waste across our entire supply chain.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.12)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(46,204,113,0.12)' }}>
                    <Droplets className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Water Conservation</h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      We employ drip irrigation and rainwater harvesting systems to minimize water usage. 
                      Every drop is used efficiently to grow your food.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.12)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(46,204,113,0.12)' }}>
                    <Wind className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Carbon Neutral Delivery</h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      Our delivery fleet uses electric vehicles and we offset remaining emissions 
                      through tree-planting partnerships.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.12)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(46,204,113,0.12)' }}>
                    <Sun className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Renewable Energy</h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      Our farms and facilities are powered by 100% solar energy, 
                      reducing our carbon footprint and ensuring a cleaner future.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SustainabilityModal;
