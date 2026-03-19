function InputField({ label, value, onChange, placeholder }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
      />
    </label>
  );
}

export default function CompanyEditor({ company, onChange }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InputField
        label="Company name"
        value={company.name}
        onChange={(value) => onChange("name", value)}
        placeholder="Northstar"
      />
      <InputField
        label="Logo text"
        value={company.logo}
        onChange={(value) => onChange("logo", value.toUpperCase().slice(0, 3))}
        placeholder="NS"
      />
      <div className="sm:col-span-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Banner tagline</span>
          <textarea
            value={company.banner}
            onChange={(event) => onChange("banner", event.target.value)}
            rows={4}
            placeholder="Build thoughtful tools that help ambitious teams hire with clarity."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
          />
        </label>
      </div>
    </div>
  );
}
