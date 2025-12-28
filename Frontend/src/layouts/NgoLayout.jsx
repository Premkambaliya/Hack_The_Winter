import { Link, Outlet, useLocation } from "react-router-dom";
import { NgoDataProvider, useNgoData } from "../pages/ngo/context";

const navItems = [
  { label: "Overview", path: "/ngo/dashboard/overview" },
  { label: "Camp Management", path: "/ngo/dashboard/camps" },
  { label: "Slot Management", path: "/ngo/dashboard/slots" },
  { label: "Donor Registry", path: "/ngo/dashboard/donors" },
  { label: "Connectivity Grid", path: "/ngo/dashboard/connectivity" },
];

function NgoShell() {
  const location = useLocation();
  const { stats, expectedActualRatio } = useNgoData();

  const heroStats = [
    { label: "Total Camps", value: stats.totalCamps },
    { label: "Active", value: stats.active },
    { label: "Upcoming", value: stats.upcoming },
    { label: "Registered", value: stats.totalRegistered },
  ];

  return (
    <div className="min-h-screen bg-[#fdf4f4] text-[#260307] font-['Nunito']">
      <div className="flex min-h-screen">
        <aside className="hidden xl:flex sticky top-0 h-screen w-80 shrink-0 flex-col gap-8 bg-linear-to-b from-[#2c0007] via-[#4a030f] to-[#6b0a1b] px-8 py-10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.4)]">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-white/60">SEBN</p>
            <h1 className="mt-3 text-3xl font-semibold">NGO Nexus</h1>
            <p className="text-sm text-white/80">Command panel for mega drives</p>
          </div>

          <nav className="space-y-1 text-sm font-semibold">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 transition ${
                  location.pathname === item.path
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {item.label}
                <span>↗</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl bg-white/15 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Emergency Desk
            </p>
            <p className="mt-2 text-xl font-semibold">Control Room 24×7</p>
            <button className="mt-4 w-full rounded-full bg-white/90 py-3 text-sm font-semibold text-[#a50727] transition hover:bg-white">
              Contact Admin
            </button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="relative bg-[#400009] px-4 py-10 text-white shadow-lg sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                  SEBN • NGO COMMAND
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                  Impact <span className="text-[#ffb4c3]">Control Tower</span>
                </h1>
                <p className="mt-4 max-w-2xl text-sm text-white/80">
                  Organise blood donation camps, orchestrate slots, and reconcile donor
                  flows without login bottlenecks.
                </p>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-5 text-center backdrop-blur">
                <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                  Expected vs Actual
                </p>
                <p className="mt-3 text-4xl font-semibold">{expectedActualRatio}%</p>
                <p className="text-sm text-white/70">Conversion</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {heroStats.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur"
                >
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">
                    {card.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto text-xs font-semibold text-white/80 xl:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 ${
                    location.pathname === item.path
                      ? "border-white bg-white/20"
                      : "border-white/40 bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default function NgoLayout() {
  return (
    <NgoDataProvider>
      <NgoShell />
    </NgoDataProvider>
  );
}
