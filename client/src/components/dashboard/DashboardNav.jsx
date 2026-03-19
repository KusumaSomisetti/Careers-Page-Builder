export default function DashboardNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-900/15">
            NS
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Recruiter Dashboard</p>
            <p className="text-xs text-slate-500">Live careers page editor</p>
          </div>
        </div>

        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          Draft mode
        </div>
      </div>
    </header>
  );
}
