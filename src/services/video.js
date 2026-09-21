export const isYoutube = (url) => /youtube\.com|youtu\.be/.test(url || '');

export const embedFromUrl = (url) => {
  if (!url) return null;
  if (url.includes('/embed/')) return url;
  const m = url.match(/(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  return url;
};