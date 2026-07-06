const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export function resolveImage(src, cacheBust = true) {
  if (!src) return null;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const path = src.startsWith('/') ? src : `/${src}`;
  let url = `${API_BASE}${path}`;
  if (cacheBust && !url.includes('?')) {
    url += `?_t=${Date.now()}`;
  }
  return url;
}

export default resolveImage;
