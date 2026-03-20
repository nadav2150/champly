/** Passed from dashboard layout via `<Outlet context={...} />` for sidebar data. */
export type DashboardOutletContext = {
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    productCount: number;
    connectedTags: number;
    pendingTags: number;
  }>;
  zones: Array<{
    id: string;
    name: string;
    storeId: string | null;
    totalTags: number;
    onlineTags: number;
    lowBattery: number;
  }>;
};
