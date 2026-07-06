import { Leaf, Mail, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = ({ onContactClick, onSustainabilityClick }) => {
  const navigate = useNavigate();

  const handleAbout = () => {
    navigate('/');
    setTimeout(() => document.getElementById('section-about')?.scrollIntoView({ behavior: 'smooth' }), 150);
  };

  const handleProducts = () => {
    navigate('/');
    setTimeout(() => document.getElementById('section-fruits')?.scrollIntoView({ behavior: 'smooth' }), 150);
  };

  return (
    <footer className="site-footer bg-black/50 pt-20 pb-10 border-t border-white/5">
      <div className="section-container">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="text-primary" size={24} />
              <span className="site-footer-brand text-2xl font-bold tracking-tighter">NATURAL<span className="text-primary">FOODS</span></span>
            </div>
            <p className="site-footer-copy text-text-muted max-w-sm mb-8">
              We are dedicated to providing the highest quality organic products to our customers. 
              Our mission is to promote a healthy lifestyle through natural nutrition.
            </p>
          </div>

          <div>
            <h4 className="site-footer-heading text-white font-bold mb-6 uppercase tracking-widest text-sm">Our Address</h4>
            <ul className="site-footer-list flex flex-col gap-4 text-text-muted">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary mt-1" size={18} />
                <span>Erospark Technologies Pvt Ltd, <br />Erode</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary" size={18} />
                <span>+91 9361249860</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary" size={18} />
                <span>varasanpoo831@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="site-footer-heading text-white font-bold mb-6 uppercase tracking-widest text-sm">Quick Links</h4>
            <ul className="site-footer-list flex flex-col gap-4 text-text-muted">
              <li><button onClick={handleAbout} className="site-footer-link hover:text-primary transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}>About Us</button></li>
              <li><button onClick={handleProducts} className="site-footer-link hover:text-primary transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}>Our Products</button></li>
              <li><button onClick={onSustainabilityClick} className="site-footer-link hover:text-primary transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}>Sustainability</button></li>
            </ul>
          </div>
        </div>
        
        <div className="site-footer-bottom pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted text-sm">
          <p>© 2026 Natural Foods Organic World. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="site-footer-link hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="site-footer-link hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
