function PreviewJobCard({ job }) {
  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_72px_rgba(15,23,42,0.10)]">
      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        <span>{job.location}</span>
        <span>{job.type}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{job.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{job.summary}</p>
    </article>
  );
}

function FiltersPanel({ filters, locations, types, onFilterChange }) {
  return (
    <div className="grid gap-3 rounded-[28px] border border-slate-200/80 bg-slate-50 p-4 sm:grid-cols-3 sm:p-5">
      <label className="block space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Search</span>
        <input
          type="text"
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
          placeholder="Search roles"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Location</span>
        <select
          value={filters.location}
          onChange={(event) => onFilterChange("location", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300"
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Type</span>
        <select
          value={filters.type}
          onChange={(event) => onFilterChange("type", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300"
        >
          <option value="">All types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default function CareersPreview({ page, filters, onFilterChange, jobsState }) {
  const locations = [...new Set(page.jobs.map((job) => job.location).filter(Boolean))];
  const types = [...new Set(page.jobs.map((job) => job.type).filter(Boolean))];

  return (
    <section className="space-y-6 rounded-[32px] border border-slate-200/80 bg-white/70 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4 rounded-[28px] border border-slate-200/70 bg-white px-4 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
            {page.company.logo || "NS"}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">{page.company.name}</p>
            <p className="text-xs text-slate-500">Careers</p>
          </div>
        </div>
        <div className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 sm:block">
          View open roles
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(241,245,249,0.72))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-10">
        <div className="space-y-5">
          <div className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
            Join the team
          </div>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Careers at {page.company.name}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {page.company.banner}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
              View open roles
            </div>
            <div className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
              Learn about us
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">About</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            A calm, focused place to do the best work of your career.
          </h2>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">{page.about}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200/70 bg-slate-50 p-5 sm:p-6">
          <div className="space-y-3">
            <div className="rounded-2xl border border-white bg-white px-4 py-4 text-sm leading-7 text-slate-600">
              Small teams, strong ownership, and clear priorities.
            </div>
            <div className="rounded-2xl border border-white bg-white px-4 py-4 text-sm leading-7 text-slate-600">
              Hiring experiences designed to feel premium and human.
            </div>
            <div className="rounded-2xl border border-white bg-white px-4 py-4 text-sm leading-7 text-slate-600">
              A modern team that values writing, taste, and thoughtful collaboration.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Open Roles</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Opportunities currently live on your careers page.
          </h2>
        </div>

        <FiltersPanel
          filters={filters}
          locations={locations}
          types={types}
          onFilterChange={onFilterChange}
        />

        {jobsState.loading ? (
          <div className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            Loading jobs...
          </div>
        ) : jobsState.error ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-700 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            {jobsState.error}
          </div>
        ) : page.jobs.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {page.jobs.map((job) => (
              <PreviewJobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            No jobs match the current filters.
          </div>
        )}
      </div>
    </section>
  );
}
