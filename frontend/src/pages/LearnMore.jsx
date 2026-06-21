import { ArrowLeft, Leaf, Apple, Wheat, Milk, Package, Shield, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <div className="fullscreen-page" style={{ paddingTop: '100px' }}>
      <div className="page-header" style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem' }}>
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Leaf className="text-primary" size={20} />
          <span className="text-sm font-black text-white/50 uppercase tracking-widest">Learn More</span>
        </div>
      </div>

      <div className="section-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <div className="page-card-dark" style={{ padding: '3rem', borderRadius: '32px' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[3px] w-14 bg-primary rounded-full"></div>
            <span className="text-primary font-bold tracking-[0.15em] uppercase text-xs">About Our Products</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'var(--heading-font)' }}>
            NATURAL <span className="text-primary">FOODS</span>
          </h2>
          <p className="text-text-muted leading-relaxed mb-10" style={{ fontSize: '1.05rem' }}>
            We bring you the finest organic products sourced directly from trusted farms across India. 
            Every item is hand-picked, quality-checked, and delivered fresh within 24 hours of harvest.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.12)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(46,204,113,0.12)' }}>
                <Apple className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Fresh Organic Fruits</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Our fruits are grown without synthetic pesticides or fertilizers. From juicy mangoes 
                  to crisp apples, every fruit is harvested at peak ripeness for maximum flavor and nutrition.
                </p>
                <ul className="mt-3" style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Mangoes</li>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Apples</li>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Oranges</li>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Bananas</li>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Grapes</li>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Strawberries</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.12)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(46,204,113,0.12)' }}>
                <Wheat className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Organic Vegetables</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Farm-fresh vegetables grown using traditional organic methods. Rich in taste and 
                  packed with essential nutrients, our vegetables are a staple for healthy living.
                </p>
                <ul className="mt-3" style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Spinach</li>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Tomatoes</li>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Potatoes</li>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Carrots</li>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Onions</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.12)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(46,204,113,0.12)' }}>
                <Package className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Premium Nutritions</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Our nutrition products include organic dry fruits, seeds, grains, and health foods. 
                  Sourced from the best regions, they retain their natural goodness and are free from additives.
                </p>
                <ul className="mt-3" style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Dry Fruits</li>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Seeds</li>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Organic Grains</li>
                  <li className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--primary)' }}>Honey</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.12)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(46,204,113,0.12)' }}>
                <Shield className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Quality Assurance</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Every product undergoes rigorous quality checks before reaching you. We test for 
                  pesticide residue, nutritional value, and freshness to ensure 100% organic certification standards.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.12)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(46,204,113,0.12)' }}>
                <Truck className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Farm to Doorstep</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  We deliver within 24 hours of harvest to preserve maximum freshness. Our cold-chain 
                  logistics ensure that from farm to your doorstep, your food stays fresh and nutritious.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
