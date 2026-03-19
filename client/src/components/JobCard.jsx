export default function JobCard({ job }) {
  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_72px_rgba(15,23,42,0.12)]">
      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        <span>{job.location}</span>
        <span>{job.type}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
        {job.title}
      </h3>
      <p className="mt-1 text-sm font-medium text-slate-500">{job.team}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{job.summary}</p>
      <button
        type="button"
        className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Apply now
      </button>
    </article>
  );
}
