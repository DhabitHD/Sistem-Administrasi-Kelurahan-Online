import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar.jsx';
import PublicFooter from '../components/layout/PublicFooter.jsx';
import FloatingTools from '../components/common/FloatingTools.jsx';
import DepthScroll from '../components/common/DepthScroll.jsx';

export default function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <main className="page-transition">
        <Outlet />
      </main>
      <PublicFooter />
      <FloatingTools />
      <DepthScroll />
    </>
  );
}
