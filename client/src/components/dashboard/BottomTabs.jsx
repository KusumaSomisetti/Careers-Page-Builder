export default function BottomTabs({ sections, activeSection, onSelect }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur xl:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-2 rounded-[24px] border border-slate-200 bg-slate-50 p-2 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        {sections.map((section) => {
          const isActive = section.id === activeSection;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className={`flex-1 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                  : "text-slate-600 hover:bg-white hover:text-slate-950"
              }`}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
