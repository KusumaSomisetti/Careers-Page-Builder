export default function CompanyPicker({ companies, selectedSlug, onChange, disabled }) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="mb-4 space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">Active company</h2>
        <p className="text-sm leading-6 text-slate-500">
          Switch between the seeded companies and edit their careers pages individually.
        </p>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Company</span>
        <select
          value={selectedSlug}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
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
