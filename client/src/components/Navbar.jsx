import { navigationItems } from "../data/careers";

export default function Navbar() {
  return (
    <header className="px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-[28px] border border-white/70 bg-white/85 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-900/15">
            N
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Northstar</p>
            <p className="text-xs text-slate-500">Careers</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navigationItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {item}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 md:hidden"
        >
          Menu
        </button>
      </div>
    </header>
  );
}
