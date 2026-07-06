import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollStory from '../components/ScrollStory';
import { fetchStorefrontSummary, sendMessage, apiRequest } from '../lib/api';
import { ArrowRight, ShoppingCart, MapPin, Mail, Phone, Clock, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const initialFruits = [];

const HomePage = ({ onShopClick, onAddToCart, authToken, user, onAuthClick }) => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const pageSectionRef = useRef(null);
  const previousScrollRef = useRef(0);
  const resetMotionRef = useRef(null);
const [fruits, setFruits] = useState(initialFruits);
const [nutritions, setNutritions] = useState([]);
const [vegetables, setVegetables] = useState([]);
const [fruitQtys, setFruitQtys] = useState({});
const [nutritionQtys, setNutritionQtys] = useState({});
const [vegetableQtys, setVegetableQtys] = useState({});
  const [backendProductMap, setBackendProductMap] = useState({});

  const mapBackendToFrontend = (products) => {
    const map = {};
    const fruitsList = [];
    const nutritionsList = [];
    const vegetablesList = [];
    let fid = 1;
    products.forEach(p => {
      map[p.name.toLowerCase()] = p.id;
      const item = {
        id: fid,
        backendId: p.id,
        name: p.name,
        basePrice: Number(p.price),
        priceUnit: p.price_unit || 'kg',
        stock: p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Limited' : 'Out of Stock',
        image: p.image || null,
        icon: p.category?.toLowerCase() === 'fruits' ? '🍎' : null,
        category: p.category,
      };
      if (p.category?.toLowerCase() === 'fruits') {
        fruitsList.push({ ...item, icon: '🍎' });
      }
      if (p.category?.toLowerCase() === 'nutritions') {
        nutritionsList.push(item);
      }
      if (p.category?.toLowerCase() === 'vegetables') {
        vegetablesList.push(item);
      }
      fid++;
    });
    return { map, fruitsList, nutritionsList, vegetablesList };
  };

  useEffect(() => {
    let cancelled = false;
    apiRequest('/api/dashboard/storefront/products/', { method: 'GET' }).catch(() => [])
      .then(products => {
        if (cancelled || !products.length) return;
        const { map, fruitsList, nutritionsList, vegetablesList } = mapBackendToFrontend(products);
        setBackendProductMap(map);
        if (fruitsList.length) {
          setFruits(fruitsList);
          setFruitQtys(Object.fromEntries(fruitsList.map(f => [f.id, 1])));
        }
        if (nutritionsList.length) {
          setNutritions(nutritionsList);
          setNutritionQtys(Object.fromEntries(nutritionsList.map(n => [n.id, 0.1])));
        }
        if (vegetablesList.length) {
          setVegetables(vegetablesList);
          setVegetableQtys(Object.fromEntries(vegetablesList.map(v => [v.id, 1])));
        }
      })
      .catch(e => console.error('HomePage fetch error:', e));
    return () => { cancelled = true; };
  }, [authToken]);

  const fmtQty = (v, unit = 'kg') => {
    if (unit === 'gram') return `${v * 1000}g`;
    return v < 1 ? `${v * 1000}g` : `${v} kg`;
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const progress = Math.min(currentScroll / 600, 1);
      const delta = currentScroll - previousScrollRef.current;

      if (delta !== 0) {
        setScrollDirection(delta > 0 ? 1 : -1);
        setScrollVelocity(Math.min(Math.abs(delta) / 120, 1));
      }

      previousScrollRef.current = currentScroll;
      setScrollProgress(progress);

      if (resetMotionRef.current) {
        window.clearTimeout(resetMotionRef.current);
      }

      resetMotionRef.current = window.setTimeout(() => {
        setScrollVelocity(0);
        setScrollDirection(0);
      }, 140);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (resetMotionRef.current) {
        window.clearTimeout(resetMotionRef.current);
      }
    };
  }, []);

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitState, setContactSubmitState] = useState({ submitting: false, success: false, error: false });
  const [adminEmail, setAdminEmail] = useState('varasanpoo831@gmail.com');

  useEffect(() => {
    setContactForm(prev => ({
      ...prev,
      name: user?.username || '',
      email: user?.email || '',
    }));
  }, [user]);

  useEffect(() => {
    if (!authToken) return;
    let cancelled = false;
    fetchStorefrontSummary(authToken)
      .then((data) => {
        if (!cancelled && data.admin_contact?.email) {
          setAdminEmail(data.admin_contact.email);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [authToken]);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!user || !authToken) {
      onAuthClick();
      return;
    }
    if (!adminEmail) {
      setContactSubmitState({ submitting: false, success: false, error: true });
      return;
    }
    setContactSubmitState({ submitting: true, success: false, error: false });
    
    try {
      await sendMessage(authToken, {
        recipient_email: adminEmail,
        subject: `Frontend Contact: ${contactForm.name}`,
        body: `Email: ${contactForm.email}\n\n${contactForm.message}`,
      });
      setContactSubmitState({ submitting: false, success: true, error: false });
      setContactForm({ name: user?.username || '', email: user?.email || '', message: '' });
      setTimeout(() => {
        setContactSubmitState(prev => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      setContactSubmitState({ submitting: false, success: false, error: true });
    }
  };

  return (
    <main>
      <ScrollStory onShopClick={onShopClick} onLearnMoreClick={() => navigate('/learn-more')} />

      <section id="section-fruits" ref={pageSectionRef} className="py-32 bg-section-alt">
        <div className="section-container">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-primary/40"></div>
            <span className="text-primary font-bold tracking-[0.15em] uppercase text-xs">100% Organic</span>
            <div className="h-[2px] w-8 bg-primary/40"></div>
          </div>
          <h2 className="section-title text-center">OUR FRESH FRUITS</h2>
          <p className="text-text-muted text-center mb-12">Handpicked from the finest farms across India</p>
          <div className="fruit-cards-grid max-3-cols">
            {fruits.map((fruit, idx) => {
              const qty = fruitQtys[fruit.id] || 1;
              const total = fruit.basePrice * qty;

              return (
                <div key={fruit.id} className={`fruit-card ${fruit.stock === 'Out of Stock' ? 'fruit-card-out' : ''}`}>
                  <div className="fruit-card-inner">
                    <div className="fruit-card-top">
                      <span className="fruit-card-icon">{fruit.image ? <img src={fruit.image} alt="" className="fruit-card-inline-img" /> : fruit.icon}</span>
                    </div>
                    <h3 className="fruit-card-name">{fruit.name}</h3>
                    <div className="fruit-card-price-row">
                      <span className="fruit-card-price">₹{Math.round(total)}</span>
                      <span className="fruit-card-price-unit">{fmtQty(qty, fruit.priceUnit)} × ₹{Math.round(fruit.basePrice)}/{fruit.priceUnit || 'kg'}</span>
                    </div>
                    <span className={`fruit-card-stock ${fruit.stock === 'In Stock' ? 'stock-in' : 'stock-out'}`}>
                      <span className="stock-dot"></span>
                      {fruit.stock}
                    </span>
                  </div>

                  {fruit.stock !== 'Out of Stock' && (
                    <div className="fruit-card-footer">
                      <div className="fruit-card-qty">
                        <div className="fruit-card-qty-stepper">
                          <button className="qty-step-btn" onClick={e => { e.stopPropagation(); setFruitQtys(prev => ({ ...prev, [fruit.id]: Math.max(0.5, (prev[fruit.id] || 1) - 0.5) })); }}>−</button>
                          <span className="qty-step-value">{qty >= 1 ? `${qty} kg` : `${qty * 1000}g`}</span>
                          <button className="qty-step-btn" onClick={e => { e.stopPropagation(); setFruitQtys(prev => ({ ...prev, [fruit.id]: Math.min(10, (prev[fruit.id] || 1) + 0.5) })); }}>+</button>
                        </div>
                      </div>
                      <button
                        className="fruit-card-shop"
                        onClick={e => {
                          e.stopPropagation();
                          onAddToCart({ id: fruit.id, name: fruit.name, icon: fruit.icon, image: fruit.image, price: total, qty, backendProductId: backendProductMap[fruit.name.toLowerCase()] || null });
                        }}
                        title="Add Item"
                      >
                        <ShoppingCart size={14} />
                        <span>Add Item</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="section-nutritions" className="py-32 bg-section-alt">
        <div className="section-container">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-primary/40"></div>
            <span className="text-primary font-bold tracking-[0.15em] uppercase text-xs">100% Organic</span>
            <div className="h-[2px] w-8 bg-primary/40"></div>
          </div>
          <h2 className="section-title text-center">NUTRITIONS</h2>
          <p className="text-text-muted text-center mb-12">Wholesome nutrition to fuel your day</p>
          <div className="fruit-cards-grid max-3-cols">
            {nutritions.length === 0 && (
              <p className="text-text-muted text-center col-span-full">No nutrition products available yet.</p>
            )}
            {nutritions.map((item, idx) => {
              const qty = nutritionQtys[item.id] ?? 0.1;
              const total = item.basePrice * qty;

              return (
                <div key={item.id} className={`fruit-card ${item.stock === 'Out of Stock' ? 'fruit-card-out' : ''}`}>
                  <div className="fruit-card-inner">
                    <div className="fruit-card-top">
                      <span className="fruit-card-icon">{item.image ? <img src={item.image} alt="" className="fruit-card-inline-img" /> : item.icon}</span>
                    </div>
                    <h3 className="fruit-card-name">{item.name}</h3>
                    <div className="fruit-card-price-row">
                      <span className="fruit-card-price">₹{Math.round(total)}</span>
                      <span className="fruit-card-price-unit">{fmtQty(qty, item.priceUnit)} × ₹{Math.round(item.basePrice)}/{item.priceUnit || 'kg'}</span>
                    </div>
                    <span className={`fruit-card-stock ${item.stock === 'In Stock' ? 'stock-in' : 'stock-out'}`}>
                      <span className="stock-dot"></span>
                      {item.stock}
                    </span>
                  </div>

                  {item.stock !== 'Out of Stock' && (
                    <div className="fruit-card-footer">
                      <div className="fruit-card-qty">
                        <div className="fruit-card-qty-stepper">
                          <button className="qty-step-btn" onClick={e => { e.stopPropagation(); const p = nutritionQtys[item.id] || 0.1; setNutritionQtys(prev => ({ ...prev, [item.id]: Math.max(0.1, +(p - 0.1).toFixed(1)) })); }}>−</button>
                          <span className="qty-step-value">{Math.round(qty * 1000)}g</span>
                          <button className="qty-step-btn" onClick={e => { e.stopPropagation(); const p = nutritionQtys[item.id] || 0.1; setNutritionQtys(prev => ({ ...prev, [item.id]: Math.min(1, +(p + 0.1).toFixed(1)) })); }}>+</button>
                        </div>
                      </div>
                      <button
                        className="fruit-card-shop"
                        onClick={e => {
                          e.stopPropagation();
                          onAddToCart({ id: item.id, name: item.name, icon: item.icon, image: item.image, price: total, qty, backendProductId: backendProductMap[item.name.toLowerCase()] || null });
                        }}
                        title="Add Item"
                      >
                        <ShoppingCart size={14} />
                        <span>Add Item</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="section-vegetables" className="py-32 bg-section-alt">
        <div className="section-container">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-primary/40"></div>
            <span className="text-primary font-bold tracking-[0.15em] uppercase text-xs">100% Organic</span>
            <div className="h-[2px] w-8 bg-primary/40"></div>
          </div>
          <h2 className="section-title text-center">VEGETABLES</h2>
          <p className="text-text-muted text-center mb-12">Fresh, crisp vegetables straight from the farm</p>
          <div className="fruit-cards-grid max-3-cols">
            {vegetables.length === 0 && (
              <p className="text-text-muted text-center col-span-full">No vegetable products available yet.</p>
            )}
            {vegetables.map((item, idx) => {
              const qty = vegetableQtys[item.id] || 1;
              const total = item.basePrice * qty;

              return (
                <div key={item.id} className={`fruit-card ${item.stock === 'Out of Stock' ? 'fruit-card-out' : ''}`}>
                  <div className="fruit-card-inner">
                    <div className="fruit-card-top">
                      <span className="fruit-card-icon">{item.image ? <img src={item.image} alt="" className="fruit-card-inline-img" /> : item.icon}</span>
                    </div>
                    <h3 className="fruit-card-name">{item.name}</h3>
                    <div className="fruit-card-price-row">
                      <span className="fruit-card-price">₹{Math.round(total)}</span>
                      <span className="fruit-card-price-unit">{fmtQty(qty, item.priceUnit)} × ₹{Math.round(item.basePrice)}/{item.priceUnit || 'kg'}</span>
                    </div>
                    <span className={`fruit-card-stock ${item.stock === 'In Stock' ? 'stock-in' : 'stock-out'}`}>
                      <span className="stock-dot"></span>
                      {item.stock}
                    </span>
                  </div>

                  {item.stock !== 'Out of Stock' && (
                    <div className="fruit-card-footer">
                      <div className="fruit-card-qty">
                        <div className="fruit-card-qty-stepper">
                          <button className="qty-step-btn" onClick={e => { e.stopPropagation(); setVegetableQtys(prev => ({ ...prev, [item.id]: Math.max(0.5, (prev[item.id] || 1) - 0.5) })); }}>−</button>
                          <span className="qty-step-value">{qty >= 1 ? `${qty} kg` : `${qty * 1000}g`}</span>
                          <button className="qty-step-btn" onClick={e => { e.stopPropagation(); setVegetableQtys(prev => ({ ...prev, [item.id]: Math.min(10, (prev[item.id] || 1) + 0.5) })); }}>+</button>
                        </div>
                      </div>
                      <button
                        className="fruit-card-shop"
                        onClick={e => {
                          e.stopPropagation();
                          onAddToCart({ id: item.id, name: item.name, icon: item.icon, image: item.image, price: total, qty, backendProductId: backendProductMap[item.name.toLowerCase()] || null });
                        }}
                        title="Add Item"
                      >
                        <ShoppingCart size={14} />
                        <span>Add Item</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="section-about" className="min-h-screen flex items-center justify-center bg-section-alt relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-bg-section to-transparent"></div>
        <div className="section-container grid md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1">
            <div className="about-3d-wrapper relative aspect-square rounded-[40px] overflow-hidden p-8">
              <div className="about-3d-glow"></div>
              <div className="about-3d-inner">
                <img 
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800" 
                  alt="Organic Fruits" 
                  className="about-3d-image"
                />
                <div className="about-3d-border"></div>
                <div className="about-3d-card">
                  <p className="text-white font-bold text-sm">Fresh from Farm 🍃</p>
                  <p className="text-text-muted text-xs mt-1">Harvested within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[3px] w-14 bg-primary rounded-full"></div>
              <span className="text-primary font-bold tracking-[0.15em] uppercase text-xs">Direct from farm</span>
            </div>
            <h2 className="about-title">THE TASTE OF <br /><span className="text-primary">PURE NATURE</span></h2>
            <p className="text-text-muted leading-relaxed mb-10 about-text">
              Our fruits are harvested at the peak of ripeness and delivered within 24 hours. 
              Experience the true taste of nature without any chemicals or preservatives.
            </p>
            <button 
              onClick={() => navigate('/explore-farm')}
              className="btn-premium-glass"
            >
              <span>Explore Our Farm</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section id="section-contact" className="py-32 bg-section relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-bg-section-alt to-transparent"></div>
        <div className="section-container">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-primary/40"></div>
            <span className="text-primary font-bold tracking-[0.15em] uppercase text-xs">Get In Touch</span>
            <div className="h-[2px] w-8 bg-primary/40"></div>
          </div>
          <h2 className="section-title text-center">CONTACT US</h2>
          <p className="text-text-muted text-center mb-16 max-w-2xl mx-auto">
            Have questions about our organic farm products, bulk orders, or delivery? Reach out to us anytime!
          </p>

          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info-col">
              <div className="contact-info-card">
                <div className="contact-info-glow"></div>
                <div className="contact-info-inner">
                  <h3 className="contact-info-title">Contact Information</h3>
                  <p className="contact-info-desc">Feel free to contact us via email, phone, or visit our office.</p>
                  
                  <div className="contact-details-list">
                    <div className="contact-detail-item">
                      <div className="contact-detail-icon">
                        <MapPin size={20} />
                      </div>
                      <div className="contact-detail-text">
                        <h4>Our Location</h4>
                        <p>Erospark Technologies Pvt Ltd, Erode, Tamil Nadu, India</p>
                      </div>
                    </div>

                    <div className="contact-detail-item">
                      <div className="contact-detail-icon">
                        <Mail size={20} />
                      </div>
                      <div className="contact-detail-text">
                        <h4>Email Address</h4>
                        <p>varasanpoo831@gmail.com</p>
                      </div>
                    </div>

                    <div className="contact-detail-item">
                      <div className="contact-detail-icon">
                        <Phone size={20} />
                      </div>
                      <div className="contact-detail-text">
                        <h4>Phone Number</h4>
                        <p>+91 9361249860</p>
                      </div>
                    </div>

                    <div className="contact-detail-item">
                      <div className="contact-detail-icon">
                        <Clock size={20} />
                      </div>
                      <div className="contact-detail-text">
                        <h4>Business Hours</h4>
                        <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-col">
              <form onSubmit={handleContactSubmit} className="contact-form-card">
                <div className="contact-form-group">
                  <label htmlFor="contact-name">Full Name</label>
                  <input 
                    type="text" 
                    id="contact-name" 
                    name="name" 
                    placeholder="Enter your name" 
                    required 
                    className="contact-input"
                    value={contactForm.name}
                    onChange={handleContactChange}
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-email">Email Address</label>
                  <input 
                    type="email" 
                    id="contact-email" 
                    name="email" 
                    placeholder="Enter your email" 
                    required 
                    className="contact-input"
                    value={contactForm.email}
                    onChange={handleContactChange}
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-message">Your Message</label>
                  <textarea 
                    id="contact-message" 
                    name="message" 
                    placeholder="Write your message here..." 
                    rows="5" 
                    required 
                    className="contact-textarea"
                    value={contactForm.message}
                    onChange={handleContactChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn-premium-primary w-full mt-4" disabled={contactSubmitState.submitting}>
                  {contactSubmitState.submitting ? (
                    <>
                      <Loader2 size={16} className="contact-spin mr-2" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>{user ? 'Send Message' : 'Sign In To Message'}</span>
                      <Send size={16} className="ml-2" />
                    </>
                  )}
                </button>
                {contactSubmitState.success && (
                  <p className="contact-success-msg mt-4 text-center">
                    <CheckCircle2 size={16} className="mr-2" style={{ display: 'inline', verticalAlign: 'middle' }} />
                    <span>Message sent successfully! We will get back to you soon.</span>
                  </p>
                )}
                {contactSubmitState.error && (
                  <p className="contact-error-msg mt-4 text-center">
                    <AlertCircle size={16} className="mr-2" style={{ display: 'inline', verticalAlign: 'middle' }} />
                    <span>Something went wrong. Please try again.</span>
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-section">
        <div className="section-container text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-primary/40"></div>
            <span className="text-primary font-bold tracking-[0.15em] uppercase text-xs">What Our Customers Say</span>
            <div className="h-[2px] w-8 bg-primary/40"></div>
          </div>
          <h2 className="section-title text-center">TESTIMONIALS</h2>
          <div className="review-track-wrapper mt-16">
            <div className="review-track">
              {[
                { name: "Sarah J.", text: "The freshest fruits I've ever ordered online. The 3D experience is amazing!", style: "emerald" },
                { name: "Michael R.", text: "Quality is top-notch. You can really taste the difference in organic.", style: "sapphire" },
                { name: "Emma W.", text: "Love the sustainable packaging and the fast delivery service.", style: "coral" },
                { name: "David K.", text: "Amazing variety and the quality is consistent every single time.", style: "amethyst" },
                { name: "Lisa M.", text: "The farm-to-table concept is brilliant. My family loves the fresh produce!", style: "sunset" },
                { name: "James P.", text: "Customer service is excellent. They go above and beyond every time.", style: "ocean" },
              ].map((t, i) => (
                <div key={i} className={`review-card review-card--${t.style}`}>
                  <div className={`review-card-glow review-card-glow--${t.style}`}></div>
                  <div className={`review-card-badge review-card-badge--${t.style}`}>★</div>
                  <p className={`review-card-text review-card-text--${t.style}`}>"{t.text}"</p>
                  <div className="review-card-author">
                    <div className={`review-card-avatar review-card-avatar--${t.style}`}>
                      {t.name[0]}
                    </div>
                    <div className="review-card-name-wrap">
                      <p className={`review-card-name review-card-name--${t.style}`}>{t.name}</p>
                      <p className={`review-card-role review-card-role--${t.style}`}>Verified Buyer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
