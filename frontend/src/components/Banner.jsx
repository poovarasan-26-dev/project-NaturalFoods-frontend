import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const floatingFruits = [
  { src: '/images/apple-removebg-preview.png', left: '16%', startTop: -28, bowlTop: 42 },
  { src: '/images/orange-removebg-preview.png', left: '66%', startTop: -22, bowlTop: 44 },
  { src: '/images/graps-removebg-preview.png', left: '38%', startTop: -38, bowlTop: 46 },
  { src: '/images/straberry-removebg-preview.png', left: '78%', startTop: -4, bowlTop: 48 },
  { src: '/images/kiwi-removebg-preview.png', left: '48%', startTop: -14, bowlTop: 50 },
  { src: '/images/cherry-removebg-preview.png', left: '26%', startTop: -6, bowlTop: 52 },
  { src: '/images/pineapple-fruit-removebg-preview.png', left: '6%', startTop: 2, bowlTop: 54 },
  { src: '/images/lemon_cut-removebg-preview.png', left: '72%', startTop: -8, bowlTop: 56 },
];

const Banner = ({ scrollProgress, scrollDirection, scrollVelocity, onShopClick, onLearnMoreClick }) => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const fruitsContainerRef = useRef(null);
  const fruitRefs = useRef([]);

  useEffect(() => {
    const container = fruitsContainerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const ctx = gsap.context(() => {
      const ch = container.offsetHeight;
      const onReady = () => {
        const dur = video.duration || 1;

        const scrollDistance = window.innerHeight * 3;

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.5,
          invalidateOnRefresh: true,
        });

        gsap.to(video, {
          currentTime: dur,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${scrollDistance}`,
            scrub: 0.5,
            invalidateOnRefresh: true,
            id: 'video-scrub',
          },
        });

        fruitRefs.current.forEach((el, i) => {
          if (!el) return;
          const fruit = floatingFruits[i];
          const distance = ((fruit.bowlTop - fruit.startTop) / 100) * ch;

          gsap.to(el, {
            y: distance,
            rotation: (i - 3) * 5,
            scale: 0.85,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => `+=${scrollDistance}`,
              scrub: 0.5,
              invalidateOnRefresh: true,
              id: `fruit-${i}`,
            },
          });
        });
      };

      if (video.readyState >= 1) {
        onReady();
      } else {
        video.addEventListener('loadedmetadata', onReady, { once: true });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === sectionRef.current) t.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-banner min-h-screen flex items-center pt-20 overflow-hidden relative">
      <div className="hero-banner-grid section-container grid md:grid-cols-2 gap-12 items-center w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex flex-col gap-8"
        >
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-16 bg-primary"></div>
            <span className="text-primary font-bold tracking-[0.15em] uppercase text-xs">100% Organic Products</span>
          </div>
          <h1 className="banner-title">
            NATURAL <br />
            <span className="text-primary">FOODS</span> <br />
            <span className="banner-subtitle">ORGANIC</span> <br />
            WORLD
          </h1>
          <p className="hero-copy text-text-muted text-lg leading-relaxed">
            Experience the purity of nature with our hand-picked organic fruits.
            Freshness delivered straight from the farm to your doorstep.
          </p>
          <div className="flex gap-4 mt-2">
            <button onClick={onShopClick} className="btn-premium-primary">
              SHOP NOW
            </button>
            <button onClick={onLearnMoreClick} className="btn-premium-secondary">
              LEARN MORE
            </button>
          </div>

          <div className="flex gap-8 mt-4">
            <div>
              <p className="text-2xl font-black text-white">200+</p>
              <p className="text-xs text-text-muted uppercase tracking-widest font-semibold">Organic Products</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">50K+</p>
              <p className="text-xs text-text-muted uppercase tracking-widest font-semibold">Happy Customers</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">24h</p>
              <p className="text-xs text-text-muted uppercase tracking-widest font-semibold">Farm to Door</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.12 }}
          className="hero-visual-shell"
        >
          <div className="hero-visual-glow hero-visual-glow-a"></div>
          <div className="hero-visual-glow hero-visual-glow-b"></div>

          <div className="hero-visual-frame glass">
            <div className="hero-visual-scene">
              <video
                ref={videoRef}
                src="/images/videoclip.mp4"
                muted
                playsInline
                preload="auto"
                className="hero-reference-image"
              />

              <div
                ref={fruitsContainerRef}
                className="fruit-overlay-container"
              >
                {floatingFruits.map((fruit, i) => (
                  <img
                    key={fruit.src}
                    ref={el => fruitRefs.current[i] = el}
                    src={fruit.src}
                    alt=""
                    className="floating-fruit"
                    style={{
                      left: fruit.left,
                      top: `${fruit.startTop}%`,
                      transform: `rotate(${(i - 3) * 8}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
