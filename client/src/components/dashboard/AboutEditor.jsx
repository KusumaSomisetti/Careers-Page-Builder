export default function AboutEditor({ value, onChange }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">About section</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        placeholder="Describe your company, values, and what makes the team special."
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
      />
    </label>
  );
}
