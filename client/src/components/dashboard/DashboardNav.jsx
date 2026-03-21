function saveTone(state) {
  if (state.error) {
    return { label: "Needs attention", tone: "text-rose-600 border-rose-200 bg-rose-50" };
  }

  if (state.success) {
    return { label: "Saved", tone: "text-emerald-700 border-emerald-200 bg-emerald-50" };
  }

  if (state.saving) {
    return { label: "Saving", tone: "text-sky-700 border-sky-200 bg-sky-50" };
  }

  return { label: "Draft", tone: "text-slate-600 border-slate-200 bg-slate-50" };
}

export default function DashboardNav({
  companyName,
  activeSectionLabel,
  saveLabel,
  saveState,
  onSave,
  onExit
}) {
  const status = saveTone(saveState);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[110rem] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-950 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            HP
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-slate-950">Careers Page Builder</p>
            <p className="text-sm text-slate-500">
              {companyName ? `${companyName} · ${activeSectionLabel}` : `Editing ${activeSectionLabel}`}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          <div className={`rounded-full border px-4 py-2 text-sm font-medium ${status.tone}`}>
            {status.label}
          </div>
          {onExit ? (
            <button
              type="button"
              onClick={onExit}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
            >
              Back to site
            </button>
          ) : null}
          <button
            type="button"
            onClick={onSave}
            disabled={saveState.saving}
            className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(180deg,#0f8a8f_0%,#0f6469_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,118,110,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saveState.saving ? "Saving..." : saveLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
