import { useEffect, useRef, useState } from "react";

function JobField({ label, value, onChange, placeholder }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300"
      />
    </label>
  );
}

function ModeCard({ active, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[22px] border p-4 text-left transition ${
        active
          ? "border-slate-950 bg-slate-950 text-white shadow-[0_16px_34px_rgba(15,23,42,0.14)]"
          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
      }`}
    >
      <p className="text-sm font-semibold tracking-tight">{title}</p>
    </button>
  );
}

export default function JobsEditor({ jobs, onUpdateJob, onAddJob }) {
  const [mode, setMode] = useState(jobs.length > 0 ? "edit" : "add");
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || "");
  const previousCountRef = useRef(jobs.length);

  useEffect(() => {
    if (!jobs.length) {
      setMode("add");
      setSelectedJobId("");
      previousCountRef.current = 0;
      return;
    }

    if (!jobs.some((job) => job.id === selectedJobId)) {
      setSelectedJobId(jobs[0].id);
    }

    if (jobs.length > previousCountRef.current) {
      setSelectedJobId(jobs[jobs.length - 1].id);
      setMode("edit");
    }

    previousCountRef.current = jobs.length;
  }, [jobs, selectedJobId]);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) || null;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <ModeCard
          active={mode === "add"}
          title="Add new job"
          onClick={() => setMode("add")}
        />
        <ModeCard
          active={mode === "edit"}
          title="Edit existing"
          onClick={() => setMode("edit")}
        />
      </div>

      {mode === "add" ? (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-5">
          <p className="text-base font-semibold tracking-tight text-slate-950">Create a new role</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Start with a fresh draft role. Once added, it will open in the editor automatically.
          </p>
          <button
            type="button"
            onClick={onAddJob}
            className="mt-5 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add job listing
          </button>
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-4">
          <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1">
            {jobs.map((job, index) => {
              const active = job.id === selectedJobId;

              return (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedJobId(job.id)}
                  className={`min-w-[15rem] shrink-0 rounded-[20px] border px-4 py-3 text-left transition ${
                    active
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${active ? "text-slate-300" : "text-slate-400"}`}>
                    Role {index + 1}
                  </p>
                  <p className="mt-2 text-sm font-semibold tracking-tight">{job.title || "Untitled role"}</p>
                </button>
              );
            })}
          </div>

          {selectedJob ? (
            <article className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200/80 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Editing role</p>
                  <p className="mt-1 text-base font-semibold tracking-tight text-slate-950">{selectedJob.title || "Untitled role"}</p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Existing
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <JobField
                  label="Job title"
                  value={selectedJob.title}
                  onChange={(value) => onUpdateJob(selectedJob.id, "title", value)}
                  placeholder="Frontend Engineer"
                />
                <JobField
                  label="Location"
                  value={selectedJob.location}
                  onChange={(value) => onUpdateJob(selectedJob.id, "location", value)}
                  placeholder="Remote"
                />
                <JobField
                  label="Job type"
                  value={selectedJob.type}
                  onChange={(value) => onUpdateJob(selectedJob.id, "type", value)}
                  placeholder="Full-time"
                />
                <div className="sm:col-span-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Short description</span>
                    <textarea
                      value={selectedJob.summary}
                      onChange={(event) => onUpdateJob(selectedJob.id, "summary", event.target.value)}
                      rows={4}
                      placeholder="Describe the role in one short paragraph."
                      className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300"
                    />
                  </label>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-5 text-sm text-slate-500">
          No existing roles yet. Switch to add new job to create the first one.
        </div>
      )}
    </div>
  );
}

