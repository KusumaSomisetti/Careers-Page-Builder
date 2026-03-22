import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import AppShell from "../components/dashboard/AppShell";
import BrandMark from "../components/BrandMark";
import { fetchCompanies, fetchJobs, getErrorMessage } from "../services/api";
import { CardRowSkeleton, JobGridSkeleton, Skeleton } from "../components/Skeleton";

const LANDING_CACHE_KEY = "hirepoint:landing-cache:v2";

function cleanDisplayText(value) {
  return String(value || "")
    .replace(/[\uFFFD\u2022\u00B7\u2219\u22C5]+/g, " - ")
    .replace(/\s+-\s+-\s+/g, " - ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function readLandingCache() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(LANDING_CACHE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);
    const companies = Array.isArray(parsedValue?.companies) ? parsedValue.companies : [];
    const jobs = Array.isArray(parsedValue?.jobs) ? parsedValue.jobs : [];

    if (!companies.length && !jobs.length) {
      return null;
    }

    return { companies, jobs };
  } catch {
    return null;
  }
}

function writeLandingCache(companies, jobs) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      LANDING_CACHE_KEY,
      JSON.stringify({
        companies,
        jobs,
        cachedAt: Date.now()
      })
    );
  } catch {
    // Ignore cache write failures.
  }
}

function LockIcon() {
  return (
    <div className="relative h-5 w-5 text-slate-500">
      <div className="absolute left-[3px] top-[8px] h-[10px] w-[14px] rounded-[4px] bg-current" />
      <div className="absolute left-[5px] top-0 h-[10px] w-[10px] rounded-t-full border-[3px] border-b-0 border-current" />
    </div>
  );
}

function useAnimatedCount(target, loading) {
  const [count, setCount] = useState(target);

  useEffect(() => {
    if (loading) {
      return;
    }

    setCount((currentCount) => {
      if (currentCount === target) {
        return currentCount;
      }

      return currentCount;
    });

    let frameId;
    const duration = 700;
    const startValue = count;
    const startTime = performance.now();

    const tick = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(startValue + (target - startValue) * easedProgress);
      setCount(progress >= 1 ? target : nextValue);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [count, loading, target]);

  useEffect(() => {
    if (!loading && count === 0 && target === 0) {
      setCount(0);
    }
  }, [count, loading, target]);

  return count;
}

function CompanyLogo({ company, size = "default" }) {
  const containerClassName =
    size === "compact"
      ? "flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:h-18 sm:w-18"
      : "flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:h-24 sm:w-24";

  if (company.logoImageUrl) {
    return (
      <div className={containerClassName}>
        <img src={company.logoImageUrl} alt={company.name} className="h-full w-full object-cover" />
      </div>
    );
  }

  if (company.logoText || company.logo) {
    return (
      <div className={containerClassName}>
        <span className="px-2 text-center text-lg font-semibold uppercase tracking-[0.12em] text-slate-700 sm:text-xl">
          {(company.logoText || company.logo || company.name.slice(0, 2)).slice(0, 3)}
        </span>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <BrandMark />
    </div>
  );
}

function SnapshotValue({ label, value, loading }) {
  const animatedValue = useAnimatedCount(value, loading);

  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      {loading ? <Skeleton className="h-9 w-16 rounded-xl" /> : <p className="text-3xl font-semibold tracking-tight text-slate-950">{animatedValue}</p>}
      <p className="mt-2 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function CompanyCard({ company, openRoles, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(company)}
      className="flex w-[220px] shrink-0 flex-col items-center justify-center rounded-[26px] border border-slate-200/90 bg-white p-5 text-center shadow-[0_12px_36px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:w-[250px] lg:w-[280px]"
    >
      <div className="mb-5 flex items-center justify-center">
        <CompanyLogo company={company} size="compact" />
      </div>
      <p className="text-[1.7rem] font-semibold tracking-tight text-slate-950 sm:text-[1.9rem]">{company.name}</p>
      <p className="mt-1 text-[1.1rem] text-slate-700">{openRoles} Open Roles</p>
    </button>
  );
}

function ExpandedCompanyCard({ company, openRoles, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(company)}
      className="flex w-full items-center gap-4 rounded-[24px] border border-slate-200/90 bg-white p-4 text-left shadow-[0_12px_36px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_42px_rgba(15,23,42,0.10)] sm:p-5"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#eef2f7_0%,#e2e8f0_100%)] text-slate-400 shadow-inner sm:h-24 sm:w-24">
        <CompanyLogo company={company} size="compact" />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{company.name}</p>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">{openRoles} Open roles</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">Open the public careers page to explore the company experience.</p>
      </div>
    </button>
  );
}

function JobResultCard({ job }) {
  const location = cleanDisplayText(job.location);
  const type = cleanDisplayText(job.type);
  const summary = cleanDisplayText(job.summary);

  return (
    <article className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{job.company?.name || "Company"}</p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{job.title}</h3>
      <p className="mt-2 text-sm text-slate-500">{location} - {type}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{summary}</p>
    </article>
  );
}

export default function LandingPage({ onRecruiterLogin }) {
  const cachedLanding = useMemo(() => readLandingCache(), []);
  const [jobSearchValue, setJobSearchValue] = useState("");
  const [companySearchValue, setCompanySearchValue] = useState("");
  const [companiesExpanded, setCompaniesExpanded] = useState(false);
  const [companies, setCompanies] = useState(cachedLanding?.companies || []);
  const [jobs, setJobs] = useState(cachedLanding?.jobs || []);
  const [state, setState] = useState({
    loading: !cachedLanding,
    refreshing: Boolean(cachedLanding),
    error: ""
  });

  useEffect(() => {
    let isCancelled = false;

    async function loadLandingData() {
      setState((currentState) => ({
        ...currentState,
        loading: currentState.loading && !cachedLanding,
        refreshing: Boolean(cachedLanding),
        error: ""
      }));

      try {
        const [companyList, jobList] = await Promise.all([fetchCompanies(), fetchJobs()]);

        if (isCancelled) {
          return;
        }

        setCompanies(companyList);
        setJobs(jobList);
        writeLandingCache(companyList, jobList);
        setState({ loading: false, refreshing: false, error: "" });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setState({
          loading: false,
          refreshing: false,
          error: getErrorMessage(error, "Failed to load careers data.")
        });
      }
    }

    loadLandingData();

    return () => {
      isCancelled = true;
    };
  }, [cachedLanding]);

  const normalizedJobQuery = jobSearchValue.trim().toLowerCase();
  const normalizedCompanyQuery = companySearchValue.trim().toLowerCase();

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

  const featuredCompanies = useMemo(() => companies.slice(0, 8), [companies]);

  const expandedCompanies = useMemo(() => {
    if (!normalizedCompanyQuery) {
      return companies;
    }

    return companies.filter((company) => company.name.toLowerCase().includes(normalizedCompanyQuery));
  }, [companies, normalizedCompanyQuery]);

  const filteredJobs = useMemo(() => {
    if (!normalizedJobQuery) {
      return jobs;
    }

    return jobs.filter((job) => job.title.toLowerCase().includes(normalizedJobQuery));
  }, [jobs, normalizedJobQuery]);

  const openCompanyCareers = (company) => {
    const shareUrl = company.shareUrl || `${window.location.origin}/careers/${company.slug}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

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
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">HirePoint Snapshot</p>
              {state.refreshing ? <span className="text-xs font-medium text-slate-400">Refreshing...</span> : null}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <SnapshotValue label="Companies" value={companies.length} loading={state.loading} />
              <SnapshotValue label="Live roles" value={jobs.length} loading={state.loading} />
            </div>
            
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
             
            </div>

            {companies.length > 8 ? (
              <button
                type="button"
                onClick={() => setCompaniesExpanded((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:border-slate-300 hover:text-slate-950"
              >
                <span>{companiesExpanded ? "Hide all" : "View all"}</span>
                <FontAwesomeIcon icon={companiesExpanded ? faChevronUp : faChevronDown} />
              </button>
            ) : null}
          </div>

          {state.loading ? (
            <CardRowSkeleton />
          ) : featuredCompanies.length > 0 ? (
            <div className="hide-scrollbar mt-8 flex snap-x gap-5 overflow-x-auto pb-3">
              {featuredCompanies.map((company) => (
                <div key={company.slug} className="snap-start">
                  <CompanyCard company={company} openRoles={roleCounts[company.slug] || 0} onOpen={openCompanyCareers} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[26px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
              No featured companies are available right now.
            </div>
          )}

          {companiesExpanded ? (
            <div className="mt-8 rounded-[30px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
              <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-3.5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
                <label className="flex items-center gap-3 text-slate-500">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="text-base text-teal-600" />
                  <input
                    type="text"
                    value={companySearchValue}
                    onChange={(event) => setCompanySearchValue(event.target.value)}
                    placeholder="Search companies"
                    className="min-w-0 flex-1 bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </label>
              </div>

              {expandedCompanies.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {expandedCompanies.map((company) => (
                    <ExpandedCompanyCard
                      key={company.slug}
                      company={company}
                      openRoles={roleCounts[company.slug] || 0}
                      onOpen={openCompanyCareers}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-[24px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
                  No companies matched your search.
                </div>
              )}
            </div>
          ) : null}
        </section>

        <section id="roles" className="pt-14 sm:pt-16">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[3.2rem]">
              Current Opportunities
            </h2>
            <p className="mt-3 text-base text-slate-500 sm:text-lg">
              Search by job role and browse the latest openings across featured teams.
            </p>
          </div>

          <div className="mt-7 rounded-[24px] border-[4px] border-slate-400/75 bg-white/90 px-4 py-4 shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:px-6 sm:py-5">
            <label className="flex items-center gap-4 text-slate-500 sm:gap-5">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[1.5rem] text-teal-600 sm:text-[1.75rem]" />
              <input
                type="text"
                value={jobSearchValue}
                onChange={(event) => setJobSearchValue(event.target.value)}
                placeholder="Search job roles..."
                className="min-w-0 flex-1 bg-transparent text-[1.2rem] leading-tight text-slate-600 outline-none placeholder:text-slate-500 sm:text-[1.45rem] lg:text-[1.6rem]"
              />
            </label>
          </div>

          {state.loading ? (
            <JobGridSkeleton />
          ) : filteredJobs.length > 0 ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map((job) => (
                <JobResultCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[26px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
              No job roles matched your search.
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}


