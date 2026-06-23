import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = '/images/videoclip.mp4';

const ScrollStory = ({ onShopClick, onLearnMoreClick }) => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const targetTimeRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const smoothScrub = () => {
      const current = video.currentTime;
      const diff = targetTimeRef.current - current;
      if (Math.abs(diff) > 0.005) {
        video.currentTime += diff * 0.25;
        rafRef.current = requestAnimationFrame(smoothScrub);
      } else {
        video.currentTime = targetTimeRef.current;
      }
    };

    const setup = () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration) || duration <= 0) return;

      gsap.to(video, {
        currentTime: duration,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.3,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            targetTimeRef.current = self.progress * duration;
            if (!rafRef.current) {
              rafRef.current = requestAnimationFrame(smoothScrub);
            }
          },
        },
      });
    };

    const handleMeta = () => setup();
    const handleError = () => {
      video.src = '/images/videoclip.mp4';
      video.load();
    };

    if (video.readyState >= 2) {
      setup();
    } else {
      video.addEventListener('loadedmetadata', handleMeta, { once: true });
      video.addEventListener('error', handleError, { once: true });
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleMeta);
      video.removeEventListener('error', handleError);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="scroll-story-section">
      <div className="scroll-story-bg">
        <div className="scroll-story-bg-glow"></div>
      </div>
      <div className="scroll-story-inner">
        <div className="scroll-story-text-side">
          <span className="scroll-story-badge">100% Organic Products</span>
          <h1 className="scroll-story-title">
            NATURAL <br />
            <span className="text-primary">FOODS</span> <br />
            <span className="scroll-story-title-sub">ORGANIC WORLD</span>
          </h1>
          <p className="scroll-story-subtitle">
            Experience the purity of nature with our hand-picked organic fruits.
            Freshness delivered straight from the farm to your doorstep.
          </p>
          <div className="scroll-story-actions">
            <button className="scroll-story-btn-primary" onClick={onShopClick}>
              <span>SHOP NOW</span>
            </button>
            <button className="scroll-story-btn-secondary" onClick={onLearnMoreClick}>
              <span>LEARN MORE</span>
            </button>
          </div>
          <div className="scroll-story-stats">
            <div className="scroll-story-stat">
              <span className="scroll-story-stat-value">200+</span>
              <span className="scroll-story-stat-label">Organic Products</span>
            </div>
            <div className="scroll-story-stat">
              <span className="scroll-story-stat-value">50K+</span>
              <span className="scroll-story-stat-label">Happy Customers</span>
            </div>
            <div className="scroll-story-stat">
              <span className="scroll-story-stat-value">24h</span>
              <span className="scroll-story-stat-label">Farm to Door</span>
            </div>
          </div>
          <div className="scroll-story-indicator">
            <span className="scroll-story-mouse">
              <span className="scroll-story-wheel"></span>
            </span>
            <span className="scroll-story-scroll-text">Scroll to explore</span>
          </div>
        </div>
        <div className="scroll-story-video-side">
          <div className="scroll-story-video-frame">
            <div className="scroll-story-video-glow"></div>
            <video
              ref={videoRef}
              className="scroll-story-video"
              src={VIDEO_SRC}
              muted
              playsInline
              preload="auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollStory;
