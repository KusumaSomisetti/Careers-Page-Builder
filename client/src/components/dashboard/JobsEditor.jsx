function JobField({ label, value, onChange, placeholder }) {
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

export default function JobsEditor({ jobs, onUpdateJob, onAddJob }) {
  return (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <article
          key={job.id}
          className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">Role {index + 1}</p>
              <p className="text-xs text-slate-500">Visible in the live preview instantly</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <JobField
              label="Job title"
              value={job.title}
              onChange={(value) => onUpdateJob(job.id, "title", value)}
              placeholder="Frontend Engineer"
            />
            <JobField
              label="Location"
              value={job.location}
              onChange={(value) => onUpdateJob(job.id, "location", value)}
              placeholder="Remote"
            />
            <JobField
              label="Job type"
              value={job.type}
              onChange={(value) => onUpdateJob(job.id, "type", value)}
              placeholder="Full-time"
            />
            <div className="sm:col-span-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Short description</span>
                <textarea
                  value={job.summary}
                  onChange={(event) => onUpdateJob(job.id, "summary", event.target.value)}
                  rows={4}
                  placeholder="Describe the role in one short paragraph."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300"
                />
              </label>
            </div>
          </div>
        </article>
      ))}

      <button
        type="button"
        onClick={onAddJob}
        className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Add job listing
      </button>
    </div>
  );
}
