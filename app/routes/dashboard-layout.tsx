import { Outlet } from 'react-router';
import { Navbar } from '../components/dashboard/navbar';

export default function DashboardLayout() {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-dashboard-bg font-sans text-white">
      <div className="w-full shrink-0 border-b border-white/10 px-4 pt-5 pb-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
