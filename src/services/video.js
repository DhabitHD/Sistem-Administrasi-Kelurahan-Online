/* The video URL is free text from the admin form, so anything can end up here.
   Never pass a non-YouTube URL through to <iframe src>: an attacker who can save
   a video row could otherwise point the frame at a phishing page rendered inside
   our own origin. Anything we cannot positively identify becomes null. */
const YT_ID = /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/;

export const isYoutube = (url) => YT_ID.test(url || '');

export const embedFromUrl = (url) => {
  if (!url) return null;
  const m = String(url).match(YT_ID);
  if (!m) return null;
  return `https://www.youtube.com/embed/${m[1]}`;
};
