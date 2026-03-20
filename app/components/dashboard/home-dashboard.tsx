import { Link } from 'react-router';

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-dashboard-border bg-dashboard-card p-6 shadow-[0px_0px_0px_1px_#0d171a]">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-2 text-3xl font-medium tracking-tight text-white">{value}</p>
      {hint ? (
        <p className="mt-2 text-xs text-white/40">{hint}</p>
      ) : null}
    </div>
  );
}

export function HomeDashboard() {
  return (
    <div className="flex w-full flex-1 flex-col gap-8 overflow-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-medium tracking-tight text-white md:text-4xl">
          Welcome back
        </h1>
        <p className="max-w-2xl text-sm text-white/50 md:text-base">
          Remote control for your store&apos;s electronic price tags.{' '}
          <span className="text-accent-mint">Products</span> for catalog &amp; pricing,{' '}
          <span className="text-accent-mint">Tags</span> for hardware &amp; connectivity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Products" value="35" hint="Across all categories" />
        <StatCard label="Connected Tags" value="18" hint="Online right now" />
        <StatCard label="Low Battery" value="2" hint="Needs attention" />
        <StatCard label="Offline Tags" value="2" hint="No signal" />
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-3 lg:items-stretch">
        <div className="rounded-xl border border-surface-muted bg-white p-6 text-content-primary shadow-sm lg:col-span-2">
          <h2 className="text-lg font-medium text-content-primary">
            Quick actions
          </h2>
          <p className="mt-1 text-sm text-content-primary/60">
            Jump into the tools you use most.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            <li>
              <Link
                to="/stores"
                className="flex items-center justify-between rounded-lg border border-content-border bg-surface-subtle px-4 py-3 text-sm font-medium text-content-primary transition hover:border-accent-mint/40 hover:bg-accent-mint/10"
              >
                Store locations
                <span className="text-content-primary/40" aria-hidden>→</span>
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="flex items-center justify-between rounded-lg border border-content-border bg-surface-subtle px-4 py-3 text-sm font-medium text-content-primary transition hover:border-accent-mint/40 hover:bg-accent-mint/10"
              >
                Manage catalog &amp; pricing
                <span className="text-content-primary/40" aria-hidden>→</span>
              </Link>
            </li>
            <li>
              <Link
                to="/tags"
                className="flex items-center justify-between rounded-lg border border-content-border bg-surface-subtle px-4 py-3 text-sm font-medium text-content-primary transition hover:border-accent-mint/40 hover:bg-accent-mint/10"
              >
                Monitor shelf tags &amp; batteries
                <span className="text-content-primary/40" aria-hidden>→</span>
              </Link>
            </li>
            <li>
              <span className="flex cursor-default items-center justify-between rounded-lg border border-content-border/80 bg-white px-4 py-3 text-sm text-content-primary/50">
                Monitoring (coming soon)
                <span aria-hidden>—</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-dashboard-border bg-dashboard-card p-6 shadow-[0px_0px_0px_1px_#0d171a]">
          <h2 className="text-lg font-medium text-white">Today</h2>
          <p className="mt-1 text-sm text-white/50">
            2 tags with low battery — review in Tags.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              to="/tags"
              className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Go to Tags
            </Link>
            <Link
              to="/products"
              className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10"
            >
              Go to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
