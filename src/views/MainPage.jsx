import Navigation from '@/components/Navigation/Navigation';
import { Outlet } from 'react-router';

function MainPage() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}

export default MainPage;
