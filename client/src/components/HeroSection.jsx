import { company, stats } from "../data/careers";

export default function HeroSection() {
  return (
    <section className="py-8 sm:py-12">
      <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/60 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-10 lg:p-14">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Join the team
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Careers at {company.name}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {company.tagline}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#open-roles"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
              >
                View open roles
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                Learn about us
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_16px_48px_rgba(15,23,42,0.08)]"
              >
                <p className="text-2xl font-semibold tracking-tight text-slate-950">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
