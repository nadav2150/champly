import { Outlet } from 'react-router';
import { Navbar } from '../components/dashboard/navbar';

export default function DashboardLayout() {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-dashboard-bg font-sans text-white">
      <div className="w-full shrink-0 lg:border-b lg:border-white/10 lg:px-8 lg:pt-5 lg:pb-4">
        <Navbar />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden pb-16 lg:pb-0">
        <Outlet />
      </div>
    </div>
  );
}
