export default function JobFilters({
  isOpen,
  locations,
  types,
  searchValue,
  selectedLocation,
  selectedType,
  onSearchChange,
  onLocationChange,
  onTypeChange,
  onToggle,
  onReset
}) {
  return (
    <div className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex items-center justify-between gap-4 md:hidden">
        <div>
          <p className="text-sm font-semibold text-slate-950">Filter roles</p>
          <p className="text-xs text-slate-500">Search and narrow openings</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
        >
          {isOpen ? "Close" : "Filters"}
        </button>
      </div>

      <div className={`${isOpen ? "grid" : "hidden"} gap-4 md:grid md:grid-cols-[1.4fr_0.8fr_0.8fr_auto] md:items-end`}>
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Search by title
          </span>
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search roles"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Location
          </span>
          <select
            value={selectedLocation}
            onChange={(event) => onLocationChange(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
          >
            <option value="All locations">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Job type
          </span>
          <select
            value={selectedType}
            onChange={(event) => onTypeChange(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
          >
            <option value="All types">All types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
