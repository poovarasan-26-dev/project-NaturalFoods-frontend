import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf, ShoppingBag } from 'lucide-react';

const categoryConfig = {
  fruits: { title: 'Fresh Fruits', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', bg: '#e8f5e9' },
  nutritions: { title: 'Natural Nutritions', gradient: 'linear-gradient(135deg, #fdcb6e, #e17055)', bg: '#fff3e0' },
  vegetables: { title: 'Farm Vegetables', gradient: 'linear-gradient(135deg, #00b894, #00cec9)', bg: '#ffffff' },
};

const productDetails = {
  'Alphonso Mangoes': { health: 'Rich in Vitamin A, C & antioxidants. Boosts immunity and eye health.', uses: 'Perfect for smoothies, desserts, or fresh slices.' },
  'Fresh Strawberries': { health: 'High in Vitamin C & antioxidants. Supports heart health and glowing skin.', uses: 'Great in salads, jams, smoothies, or as topping.' },
  'Organic Bananas': { health: 'Potassium-rich. Supports heart health, muscle function & digestion.', uses: 'Ideal for breakfast, smoothies, baking, or energy snacks.' },
  'Red Apples': { health: 'Packed with fiber & polyphenols. Supports gut health & reduces cholesterol.', uses: 'Eat fresh, in salads, juices, or baked desserts.' },
  'Fresh Oranges': { health: 'Vitamin C powerhouse. Strengthens immunity & promotes skin health.', uses: 'Fresh juice, salads, marinades, or zesty desserts.' },
  'Green Grapes': { health: 'Rich in resveratrol & antioxidants. Supports brain & heart health.', uses: 'Eat fresh, frozen treats, juices, or wine making.' },
  'Pomegranate': { health: 'Loaded with punicalagins. Supports heart health & reduces inflammation.', uses: 'Fresh arils in salads, juices, or garnishes.' },
  'Kiwi': { health: 'Vitamin C & K rich. Supports immune system & bone health.', uses: 'Fresh slices, smoothies, fruit salads, or garnish.' },
  'Almonds': { health: 'Rich in Vitamin E, magnesium & healthy fats. Supports brain & skin health.', uses: 'Snack raw, in trail mixes, milk, or baking.' },
  'Cashews': { health: 'Magnesium, zinc & iron rich. Supports bone health & immunity.', uses: 'Snack roasted, in curries, desserts, or butter.' },
  'Walnuts': { health: 'Omega-3 powerhouse. Supports brain function & heart health.', uses: 'Eat raw, in salads, baking, or as oil.' },
  'Pistachios': { health: 'High in protein, fiber & antioxidants. Supports gut health & weight management.', uses: 'Snack, in desserts, ice cream, or trail mixes.' },
  'Raisins': { health: 'Natural iron & potassium source. Supports blood health & energy levels.', uses: 'Add to cereals, baking, trail mixes, or curries.' },
  'Dates': { health: 'Natural energy booster. Rich in fiber, potassium & essential minerals.', uses: 'Eat fresh, stuffed, in smoothies, or energy balls.' },
  'Chia Seeds': { health: 'Omega-3, fiber & protein rich. Supports digestion & heart health.', uses: 'Sprinkle on yogurt, in smoothies, or make pudding.' },
  'Flax Seeds': { health: 'Lignans, fiber & omega-3. Supports hormonal balance & digestion.', uses: 'Ground in smoothies, baking, or sprinkle on meals.' },
  'Tomato': { health: 'Lycopene rich antioxidant. Supports heart health & cancer prevention.', uses: 'Salads, sauces, soups, sandwiches, or juices.' },
  'Spinach': { health: 'Iron, Vitamin K & folate rich. Supports blood health & bone strength.', uses: 'Salads, smoothies, sautés, curries, or soups.' },
  'Broccoli': { health: 'Sulforaphane rich. Supports detoxification & immune function.', uses: 'Steamed, roasted, stir-fried, or in soups.' },
  'Carrot': { health: 'Beta-carotene rich. Supports eye health, immunity & skin health.', uses: 'Eat raw, in salads, juices, soups, or roasted.' },
  'Bell Pepper': { health: 'Vitamin C dense. Supports collagen production & skin health.', uses: 'Stir-fries, salads, stuffed, or roasted dishes.' },
  'Cucumber': { health: 'Hydrating & low calorie. Supports skin health & natural detox.', uses: 'Salads, sandwiches, infused water, or raita.' },
  'Onion': { health: 'Quercetin rich antioxidant. Supports heart health & immunity.', uses: 'Curries, salads, stir-fries, soups, or pickled.' },
  'Garlic': { health: 'Allicin rich. Supports immune system, heart health & inflammation.', uses: 'Curries, stir-fries, soups, or roasted dishes.' },
};

const ProductCard = ({ product, categoryKey }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    const el = document.getElementById(`farm-product-${product.id}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [product.id]);

  const imageUrl = product.image
    ? `${product.image}${product.image.includes('?_t=') ? '' : '?_t=' + Date.now()}`
    : null;

  return (
    <motion.div
      id={`farm-product-${product.id}`}
      className="farm-card"
      style={{ background: categoryConfig[categoryKey]?.bg }}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="farm-card-img-wrap" style={{ background: categoryConfig[categoryKey]?.bg }}>
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className="farm-card-img" />
        ) : (
          <div className="farm-card-placeholder">
            <Leaf size={40} />
          </div>
        )}
      </div>
      <div className="farm-card-body">
        <div className="farm-card-tag" style={{ background: categoryConfig[categoryKey]?.gradient }}>
          {categoryKey}
        </div>
        <h3 className="farm-card-name">{product.name}</h3>
        <p className="farm-card-health">
          <span className="farm-card-label">Health:</span> {productDetails[product.name]?.health || 'Packed with essential nutrients for a healthy lifestyle.'}
        </p>
        <p className="farm-card-uses">
          <span className="farm-card-label">Uses:</span> {productDetails[product.name]?.uses || 'Ideal for daily consumption in various preparations.'}
        </p>
      </div>
    </motion.div>
  );
};

const ExploreFarm = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/dashboard/storefront/products/?_=' + Date.now())
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (!cancelled) { setProducts(data); setLoading(false); }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const getByCategory = (cat) => products.filter(p => p.category?.toLowerCase() === cat);
  const fruits = getByCategory('fruits');
  const nutritions = getByCategory('nutritions');
  const vegetables = getByCategory('vegetables');
  const allProducts = [...fruits, ...nutritions, ...vegetables];

  const sections = [
    { key: 'fruits', products: fruits, config: categoryConfig.fruits },
    { key: 'nutritions', products: nutritions, config: categoryConfig.nutritions },
    { key: 'vegetables', products: vegetables, config: categoryConfig.vegetables },
  ];

  return (
    <div className="farm-page">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
        <div className="flex items-center gap-2">
          <Leaf className="text-primary" size={20} />
          <span className="text-sm font-black text-white/50 uppercase tracking-widest">Explore Our Farm</span>
        </div>
      </div>

      <div className="farm-hero">
        <div className="farm-hero-bg" />
        <motion.div
          className="farm-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="farm-hero-title">EXPLORE OUR FARM</h1>
          <p className="farm-hero-subtitle">
            Fresh fruits, natural nutritions & farm vegetables — hand-picked and delivered with care.
          </p>
        </motion.div>
      </div>

      <div className="farm-content">
        {loading ? (
          <div className="farm-loading">
            <div className="farm-loading-spinner" />
            <p>Loading...</p>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="farm-empty">
            <Leaf size={64} />
            <h3>No Products Yet</h3>
            <p>Upload products in the dashboard to see them here.</p>
          </div>
        ) : (
          sections.map(({ key, products: prods, config }) =>
            prods.length > 0 && (
              <section key={key} className="farm-section">
                <div className="farm-section-header">
                  <div className="farm-section-strip" style={{ background: config.gradient }} />
                  <h2 className="farm-section-title" style={{ background: config.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {config.title}
                  </h2>
                </div>
                <div className="farm-grid">
                  {prods.map(p => (
                    <ProductCard key={p.id} product={p} categoryKey={key} />
                  ))}
                </div>
              </section>
            )
          )
        )}
      </div>

      {allProducts.length > 0 && (
        <div className="farm-shop-now-wrap">
          <button className="farm-shop-now-btn" onClick={() => navigate('/')}>
            <ShoppingBag size={20} />
            <span>Shop Now</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreFarm;
