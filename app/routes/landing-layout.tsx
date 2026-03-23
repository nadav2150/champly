import { Outlet } from 'react-router';

export default function LandingLayout() {
  return (
    <div className='min-h-dvh bg-white font-sans text-slate-900'>
      <Outlet />
    </div>
  );
}
