import React from 'react';

const Marquee = () => {
  return (
    <div className="w-full bg-primary py-2 overflow-hidden border-b border-white/10 relative z-50">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-black font-bold text-sm mx-8 uppercase tracking-widest">
            🌿 Organic Natural Foods • 3D Animation Demo • Fresh Fruits Delivered • Healthy Lifestyle • 
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
