import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/dashboard/AppShell";
import BrandMark from "../components/BrandMark";
import { fetchCompanies, fetchJobs, getErrorMessage } from "../services/api";

function SearchIcon() {
  return (
    <div className="relative h-10 w-10 text-teal-600 sm:h-12 sm:w-12">
      <div className="absolute left-0 top-0 h-7 w-7 rounded-full border-[4px] border-current sm:h-8 sm:w-8" />
      <div className="absolute bottom-1 right-0 h-4 w-[4px] rotate-[-45deg] rounded-full bg-current sm:h-5" />
    </div>
  );
}

function LockIcon() {
  return (
    <div className="relative h-5 w-5 text-slate-500">
      <div className="absolute left-[3px] top-[8px] h-[10px] w-[14px] rounded-[4px] bg-current" />
      <div className="absolute left-[5px] top-0 h-[10px] w-[10px] rounded-t-full border-[3px] border-b-0 border-current" />
    </div>
  );
}

function CompanyCard({ company, openRoles, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(company.slug)}
      className="w-[260px] shrink-0 rounded-[26px] border border-slate-200/90 bg-white p-5 text-left shadow-[0_12px_36px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:w-[300px] lg:w-[340px]"
    >
      <div className="mb-5 flex h-32 items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#eef2f7_0%,#e2e8f0_100%)] text-slate-400 shadow-inner sm:h-36 lg:h-40">
        <BrandMark />
      </div>
      <p className="text-[1.7rem] font-semibold tracking-tight text-slate-950 sm:text-[1.9rem]">{company.name}</p>
      <p className="mt-1 text-[1.1rem] text-slate-700">{openRoles} Open Roles</p>
    </button>
  );
}

function JobResultCard({ job }) {
  return (
    <article className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{job.company?.name || "Company"}</p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{job.title}</h3>
      <p className="mt-2 text-sm text-slate-500">{job.location} • {job.type}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{job.summary}</p>
    </article>
  );
}

export default function LandingPage({ onRecruiterLogin }) {
  const [searchValue, setSearchValue] = useState("");
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });

  useEffect(() => {
    let isCancelled = false;

    async function loadLandingData() {
      setState({ loading: true, error: "" });

      try {
        const [companyList, jobList] = await Promise.all([fetchCompanies(), fetchJobs()]);

        if (isCancelled) {
          return;
        }

        setCompanies(companyList);
        setJobs(jobList);
        setState({ loading: false, error: "" });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setState({
          loading: false,
          error: getErrorMessage(error, "Failed to load careers data.")
        });
      }
    }

    loadLandingData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const normalizedQuery = searchValue.trim().toLowerCase();

  const roleCounts = useMemo(() => {
    return jobs.reduce((accumulator, job) => {
      const slug = job.company?.slug;
      if (!slug) {
        return accumulator;
      }

      accumulator[slug] = (accumulator[slug] || 0) + 1;
      return accumulator;
    }, {});
  }, [jobs]);

  const filteredCompanies = useMemo(() => {
    if (!normalizedQuery) {
      return companies;
    }

    return companies.filter((company) => company.name.toLowerCase().includes(normalizedQuery));
  }, [companies, normalizedQuery]);

  const filteredJobs = useMemo(() => {
    if (!normalizedQuery) {
      return jobs.slice(0, 6);
    }

    return jobs
      .filter((job) => {
        const companyName = job.company?.name?.toLowerCase() || "";
        return (
          job.title.toLowerCase().includes(normalizedQuery) ||
          companyName.includes(normalizedQuery) ||
          (job.summary || "").toLowerCase().includes(normalizedQuery)
        );
      })
      .slice(0, 6);
  }, [jobs, normalizedQuery]);

  return (
    <AppShell>
      <main className="mx-auto min-h-screen max-w-[92rem] overflow-x-clip px-4 pb-14 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-16">
        <header className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap sm:items-center">
          <div className="flex items-center gap-4 sm:gap-5">
            <BrandMark />
            <div className="leading-[0.9] tracking-tight text-slate-950">
              <p className="text-[1.7rem] font-semibold sm:text-[2rem]">HIREPOINT</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRecruiterLogin()}
            className="inline-flex w-full items-center justify-center gap-3 rounded-[18px] bg-[linear-gradient(180deg,rgba(241,245,249,0.95),rgba(226,232,240,0.95))] px-4 py-3 text-base font-medium text-slate-800 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)] sm:w-auto sm:px-5 sm:py-3.5 sm:text-[1rem] lg:px-6 lg:text-[1.05rem]"
          >
            <LockIcon />
            <span className="whitespace-nowrap">Recruiter Login</span>
          </button>
        </header>

        <section className="pt-12 sm:pt-14 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-8 lg:pt-14 xl:gap-12">
          <div className="max-w-4xl">
            <h1 className="max-w-[10ch] text-[3.2rem] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950 sm:max-w-[12ch] sm:text-[4.4rem] lg:max-w-none lg:whitespace-nowrap lg:text-[4.8rem] xl:text-[5.4rem]">
              Find your next chapter.
            </h1>

            <div className="mt-7 rounded-[24px] border-[4px] border-slate-400/75 bg-white/90 px-4 py-4 shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:px-6 sm:py-5">
              <label className="flex items-center gap-4 sm:gap-5">
                <SearchIcon />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search jobs, keywords, or companies..."
                  className="min-w-0 flex-1 bg-transparent text-[1.2rem] leading-tight text-slate-600 outline-none placeholder:text-slate-500 sm:text-[1.55rem] lg:text-[1.75rem]"
                />
              </label>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
              <a
                href="#roles"
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(180deg,#9aa5af_0%,#7d8893_100%)] px-6 py-3.5 text-[1rem] font-medium text-white shadow-[0_12px_30px_rgba(100,116,139,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(100,116,139,0.34)] sm:px-7 sm:py-4 sm:text-[1.05rem]"
              >
                Browse All Jobs
              </a>
              <a
                href="#companies"
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(180deg,#9aa5af_0%,#7d8893_100%)] px-6 py-3.5 text-[1rem] font-medium text-white shadow-[0_12px_30px_rgba(100,116,139,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(100,116,139,0.34)] sm:px-7 sm:py-4 sm:text-[1.05rem]"
              >
                Explore Companies
              </a>
            </div>
          </div>

          <div className="mt-8 rounded-[32px] border border-white/80 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(226,232,240,0.68))] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6 lg:mt-1">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">HirePoint Snapshot</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                <p className="text-3xl font-semibold tracking-tight text-slate-950">{companies.length}</p>
                <p className="mt-2 text-sm text-slate-500">Featured companies</p>
              </div>
              <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                <p className="text-3xl font-semibold tracking-tight text-slate-950">{jobs.length}</p>
                <p className="mt-2 text-sm text-slate-500">Live roles</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Explore curated career experiences, search roles across top software teams, and jump into the recruiter workspace when you need to edit content.
            </p>
          </div>
        </section>

        {state.error ? (
          <div className="mt-10 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {state.error}
          </div>
        ) : null}

        <section id="companies" className="pt-14 sm:pt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[3.2rem]">
                Featured Companies
              </h2>
              <p className="mt-3 text-base text-slate-500 sm:text-lg">
                {normalizedQuery ? "Matching companies from your search." : "Hand-picked software teams hiring right now."}
              </p>
            </div>
          </div>

          {state.loading ? (
            <div className="mt-8 rounded-[26px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
              Loading featured companies...
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="hide-scrollbar mt-8 flex snap-x gap-5 overflow-x-auto pb-3">
              {filteredCompanies.slice(0, 6).map((company) => (
                <div key={company.slug} className="snap-start">
                  <CompanyCard
                    company={company}
                    openRoles={roleCounts[company.slug] || 0}
                    onSelect={onRecruiterLogin}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[26px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
              No companies matched your search.
            </div>
          )}
        </section>

        <section id="roles" className="pt-14 sm:pt-16">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[3.2rem]">
              Browse Roles
            </h2>
            <p className="mt-3 text-base text-slate-500 sm:text-lg">
              Search results update instantly across jobs and companies.
            </p>
          </div>

          {state.loading ? (
            <div className="mt-8 rounded-[26px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
              Loading roles...
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map((job) => (
                <JobResultCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[26px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
              No jobs matched your search.
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}

