import ScrollStory from '../components/ScrollStory';

const ScrollStoryPage = () => {
  return (
    <>
      <ScrollStory />
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-section)', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: 'var(--text-main)' }}>
          More Content Below
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '500px', lineHeight: 1.7 }}>
          This is just a spacer section to demonstrate the scroll-triggered video experience above.
          In a real implementation, this would be your actual page content following the hero.
        </p>
      </div>
    </>
  );
};

export default ScrollStoryPage;
