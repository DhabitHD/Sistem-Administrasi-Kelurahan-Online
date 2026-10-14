import { Component } from 'react';

/**
 * Last-resort guard: any render throw below this point would otherwise leave the
 * resident with a blank white page and no way out. ponytail: only catches render
 * errors, not async ones — async failures are handled per-hook (see store.js).
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Render error:', error, info?.componentStack);
  }

  componentDidMount() {
    /* Browser Back/Forward is a popstate navigation — no document reload, so the
       error screen would otherwise stick even though the URL already changed.
       Listening here rather than on a route-change event is deliberate: capturing
       an error unmounts the children, so anything inside them (ScrollToTop) is gone
       and can no longer signal a route change. */
    this.reset = () => this.setState((s) => (s.error ? { error: null } : null));
    window.addEventListener('popstate', this.reset);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.reset);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="container py-5">
        <div className="empty-state py-5 text-center">
          <h1 className="h4 mb-3">Terjadi kesalahan</h1>
          <p className="text-muted mb-4">
            Halaman ini gagal ditampilkan. Coba muat ulang — jika tetap bermasalah, hubungi
            kelurahan di halaman Kontak.
          </p>
          <button type="button" className="btn btn-brand me-2" onClick={() => window.location.reload()}>
            Muat ulang halaman
          </button>
          <a className="btn btn-outline-secondary" href="/kontak">
            Halaman kontak
          </a>
        </div>
      </div>
    );
  }
}
