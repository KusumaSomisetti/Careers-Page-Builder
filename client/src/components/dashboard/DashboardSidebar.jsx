const baseClasses =
  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition";

export default function DashboardSidebar({
  sections,
  activeSection,
  isCollapsed,
  onToggle,
  onSelect
}) {
  return (
    <aside className="hidden lg:block">
      <div className={`sticky top-24 rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${isCollapsed ? "w-24" : "w-72"}`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          {!isCollapsed && (
            <div>
              <p className="text-sm font-semibold text-slate-950">Editor</p>
              <p className="text-xs text-slate-500">Manage page content</p>
            </div>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
          >
            {isCollapsed ? "Open" : "Close"}
          </button>
        </div>

        <nav className="space-y-2">
          {sections.map((section) => {
            const isActive = section.id === activeSection;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelect(section.id)}
                className={`${baseClasses} ${
                  isActive
                    ? "w-full bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                    : "w-full text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                } ${isCollapsed ? "justify-center" : "justify-start"}`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-xs font-semibold ring-1 ring-inset ring-white/10">
                  {section.label.slice(0, 1)}
                </span>
                {!isCollapsed && <span>{section.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
