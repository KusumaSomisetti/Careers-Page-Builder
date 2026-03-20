export default function CompanyPicker({ companies, selectedSlug, onChange, disabled }) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/96 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Workspace</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Active company</h2>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {companies.length} loaded
        </div>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Select company</span>
        <select
          value={selectedSlug}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="w-full rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          {companies.map((company) => (
            <option key={company.slug} value={company.slug}>
              {company.name}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
