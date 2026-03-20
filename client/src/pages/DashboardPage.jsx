import { useEffect, useState } from "react";
import BottomTabs from "../components/dashboard/BottomTabs";
import DashboardNav from "../components/dashboard/DashboardNav";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import EditorCard from "../components/dashboard/EditorCard";
import CompanyEditor from "../components/dashboard/CompanyEditor";
import CompanyPicker from "../components/dashboard/CompanyPicker";
import AboutEditor from "../components/dashboard/AboutEditor";
import JobsEditor from "../components/dashboard/JobsEditor";
import AppShell from "../components/dashboard/AppShell";
import CareersPreview from "../components/preview/CareersPreview";
import { dashboardSections, initialCareerPage } from "../data/careers";
import {
  createCompany,
  createJob,
  fetchCompanies,
  fetchCompanyBySlug,
  fetchJobs,
  getErrorMessage,
  updateCompany,
  updateJob
} from "../services/api";



function createDraftJob(index) {
  return {
    id: `draft-${Date.now()}-${index}`,
    title: "New Role",
    location: "Remote",
    type: "Full-time",
    summary: "Add a short summary for this new position."
  };
}

function toCompanyState(company) {
  return {
    name: company.name || "",
    logo: company.logo || "",
    banner: company.banner || ""
  };
}

function createEmptyStatus() {
  return {
    saving: false,
    error: "",
    success: ""
  };
}

function SectionActions({ label, state, onSave }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-h-6 text-sm">
        {state.error ? (
          <p className="text-rose-600">{state.error}</p>
        ) : state.success ? (
          <p className="text-emerald-600">{state.success}</p>
        ) : (
          <p className="text-slate-400">Changes save to Supabase through the Express API.</p>
        )}
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={state.saving}
        className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {state.saving ? "Saving..." : label}
      </button>
    </div>
  );
}

export default function DashboardPage({ initialCompanySlug = "stripe", onExit }) {
  const [activeSection, setActiveSection] = useState("company");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [careerPage, setCareerPage] = useState(initialCareerPage);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanySlug, setSelectedCompanySlug] = useState("");
  const [companyExists, setCompanyExists] = useState(false);
  const [dashboardState, setDashboardState] = useState({
    loading: true,
    error: "",
    notice: ""
  });
  const [companyStatus, setCompanyStatus] = useState(createEmptyStatus());
  const [aboutStatus, setAboutStatus] = useState(createEmptyStatus());
  const [jobsStatus, setJobsStatus] = useState({
    loading: false,
    error: "",
    saving: false,
    success: ""
  });
  const [jobFilters, setJobFilters] = useState({
    search: "",
    location: "",
    type: ""
  });

  useEffect(() => {
    let isCancelled = false;

    async function loadCompanies() {
      setDashboardState({ loading: true, error: "", notice: "Loading seeded companies..." });

      try {
        const companyList = await fetchCompanies();

        if (isCancelled) {
          return;
        }

        setCompanies(companyList);

        const initialSlug =
          companyList.find((company) => company.slug === initialCompanySlug)?.slug ||
          companyList[0]?.slug ||
          "";

        setSelectedCompanySlug(initialSlug);

        if (!initialSlug) {
          setCompanyExists(false);
          setDashboardState({
            loading: false,
            error: "",
            notice: "No companies found yet. Save company details to create the first one."
          });
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setDashboardState({
          loading: false,
          error: getErrorMessage(error, "Failed to load companies."),
          notice: ""
        });
      }
    }

    loadCompanies();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedCompanySlug) {
      return;
    }

    let isCancelled = false;

    async function loadCompanyDashboard() {
      setDashboardState({ loading: true, error: "", notice: "Loading company data..." });
      setJobsStatus((current) => ({ ...current, loading: true, error: "", success: "" }));
      setCompanyStatus(createEmptyStatus());
      setAboutStatus(createEmptyStatus());
      setJobFilters({ search: "", location: "", type: "" });

      try {
        const [company, jobs] = await Promise.all([
          fetchCompanyBySlug(selectedCompanySlug),
          fetchJobs({ companySlug: selectedCompanySlug })
        ]);

        if (isCancelled) {
          return;
        }

        setCompanyExists(true);
        setCareerPage({
          company: toCompanyState(company),
          about: company.about || "",
          jobs
        });
        setDashboardState({ loading: false, error: "", notice: `Loaded ${company.name} from Supabase.` });
        setJobsStatus((current) => ({ ...current, loading: false, error: "" }));
      } catch (error) {
        if (isCancelled) {
          return;
        }

        if (error.response?.status === 404) {
          setCompanyExists(false);
          setCareerPage(initialCareerPage);
          setDashboardState({
            loading: false,
            error: "",
            notice: "This company was not found. Save company details to create it."
          });
          setJobsStatus((current) => ({ ...current, loading: false, error: "" }));
          return;
        }

        setDashboardState({
          loading: false,
          error: getErrorMessage(error, "Failed to load dashboard data."),
          notice: ""
        });
        setJobsStatus((current) => ({
          ...current,
          loading: false,
          error: getErrorMessage(error, "Failed to load jobs.")
        }));
      }
    }

    loadCompanyDashboard();

    return () => {
      isCancelled = true;
    };
  }, [selectedCompanySlug]);

  const updateCompanyField = (field, value) => {
    setCompanyStatus(createEmptyStatus());
    setAboutStatus(createEmptyStatus());
    setCareerPage((current) => ({
      ...current,
      company: {
        ...current.company,
        [field]: value
      }
    }));
  };

  const updateAbout = (value) => {
    setAboutStatus(createEmptyStatus());
    setCareerPage((current) => ({
      ...current,
      about: value
    }));
  };

  const updateJobField = (jobId, field, value) => {
    setJobsStatus((current) => ({ ...current, error: "", success: "" }));
    setCareerPage((current) => ({
      ...current,
      jobs: current.jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              [field]: value
            }
          : job
      )
    }));
  };

  const addJobDraft = () => {
    setJobsStatus((current) => ({ ...current, error: "", success: "" }));
    setCareerPage((current) => ({
      ...current,
      jobs: [...current.jobs, createDraftJob(current.jobs.length + 1)]
    }));
    setActiveSection("jobs");
  };

  const persistCompany = async () => {
    const payload = {
      name: careerPage.company.name,
      logo: careerPage.company.logo,
      banner: careerPage.company.banner,
      about: careerPage.about
    };

    const savedCompany = companyExists
      ? await updateCompany(selectedCompanySlug, payload)
      : await createCompany(payload);

    setSelectedCompanySlug(savedCompany.slug);
    setCompanyExists(true);
    setCareerPage((current) => ({
      ...current,
      company: toCompanyState(savedCompany),
      about: savedCompany.about || current.about
    }));
    setCompanies((current) => {
      const nextCompanies = current.filter((company) => company.slug !== selectedCompanySlug);
      nextCompanies.push(savedCompany);
      return nextCompanies.sort((left, right) => left.name.localeCompare(right.name));
    });

    return savedCompany;
  };

  const saveCompanyDetails = async () => {
    setCompanyStatus({ saving: true, error: "", success: "" });

    try {
      const savedCompany = await persistCompany();
      setCompanyStatus({ saving: false, error: "", success: "Company details saved." });
      setDashboardState((current) => ({ ...current, notice: `Connected to ${savedCompany.name}.` }));
    } catch (error) {
      setCompanyStatus({
        saving: false,
        error: getErrorMessage(error, "Failed to save company details."),
        success: ""
      });
    }
  };

  const saveAboutSection = async () => {
    setAboutStatus({ saving: true, error: "", success: "" });

    try {
      const savedCompany = await persistCompany();
      setAboutStatus({ saving: false, error: "", success: "About section saved." });
      setDashboardState((current) => ({ ...current, notice: `Connected to ${savedCompany.name}.` }));
    } catch (error) {
      setAboutStatus({
        saving: false,
        error: getErrorMessage(error, "Failed to save about section."),
        success: ""
      });
    }
  };

  const saveJobsSection = async () => {
    setJobsStatus((current) => ({ ...current, saving: true, error: "", success: "" }));

    try {
      const savedCompany = await persistCompany();
      const savedJobs = await Promise.all(
        careerPage.jobs.map((job) => {
          const payload = {
            title: job.title,
            location: job.location,
            type: job.type,
            summary: job.summary
          };

          return job.id.startsWith("draft-")
            ? createJob(savedCompany.slug, payload)
            : updateJob(job.id, payload);
        })
      );

      setCareerPage((current) => ({
        ...current,
        jobs: savedJobs
      }));
      setJobsStatus((current) => ({
        ...current,
        loading: false,
        saving: false,
        error: "",
        success: "Job listings saved."
      }));
      setDashboardState((current) => ({ ...current, notice: `Connected to ${savedCompany.name}.` }));
    } catch (error) {
      setJobsStatus((current) => ({
        ...current,
        saving: false,
        error: getErrorMessage(error, "Failed to save job listings."),
        success: ""
      }));
    }
  };

  const handleFilterChange = (field, value) => {
    setJobFilters((current) => ({
      ...current,
      [field]: value
    }));
  };

  const normalizedSearch = jobFilters.search.trim().toLowerCase();
  const previewJobs = careerPage.jobs.filter((job) => {
    const matchesSearch =
      normalizedSearch.length === 0 || job.title.toLowerCase().includes(normalizedSearch);
    const matchesLocation = !jobFilters.location || job.location === jobFilters.location;
    const matchesType = !jobFilters.type || job.type === jobFilters.type;

    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <AppShell>
      <DashboardNav
        companyName={careerPage.company.name}
        companyCount={companies.length}
        onExit={onExit}
      />
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start">
          <DashboardSidebar
            sections={dashboardSections}
            activeSection={activeSection}
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed((current) => !current)}
            onSelect={setActiveSection}
          />

          <div className="space-y-6">
            {dashboardState.error ? (
              <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                {dashboardState.error}
              </div>
            ) : dashboardState.notice ? (
              <div className="rounded-[28px] border border-sky-200 bg-sky-50 px-5 py-4 text-sm text-sky-700 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                {dashboardState.notice}
              </div>
            ) : null}

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <CompanyPicker
                  companies={companies}
                  selectedSlug={selectedCompanySlug}
                  onChange={setSelectedCompanySlug}
                  disabled={dashboardState.loading || companies.length === 0}
                />

                {dashboardState.loading ? (
                  <div className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-12 text-sm text-slate-500 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                    Loading dashboard data...
                  </div>
                ) : null}

                {!dashboardState.loading && activeSection === "company" && (
                  <EditorCard
                    title="Company details"
                    description="Update the selected company identity and hero banner content."
                    actions={
                      <SectionActions
                        label="Save company details"
                        state={companyStatus}
                        onSave={saveCompanyDetails}
                      />
                    }
                  >
                    <CompanyEditor
                      company={careerPage.company}
                      selectedSlug={selectedCompanySlug}
                      onChange={updateCompanyField}
                    />
                  </EditorCard>
                )}

                {!dashboardState.loading && activeSection === "about" && (
                  <EditorCard
                    title="About section"
                    description="Refine the story candidates read before they explore open roles."
                    actions={
                      <SectionActions
                        label="Save about section"
                        state={aboutStatus}
                        onSave={saveAboutSection}
                      />
                    }
                  >
                    <AboutEditor value={careerPage.about} onChange={updateAbout} />
                  </EditorCard>
                )}

                {!dashboardState.loading && activeSection === "jobs" && (
                  <EditorCard
                    title="Job listings"
                    description="Edit the imported roles for the selected company and preview them instantly."
                    actions={
                      <SectionActions
                        label="Save job listings"
                        state={jobsStatus}
                        onSave={saveJobsSection}
                      />
                    }
                  >
                    <JobsEditor
                      jobs={careerPage.jobs}
                      onUpdateJob={updateJobField}
                      onAddJob={addJobDraft}
                    />
                  </EditorCard>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <p className="text-sm font-semibold text-slate-950">Editing focus</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Switch between imported companies, update their content, and preview each careers page in real time.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {dashboardSections.map((section) => {
                      const isActive = section.id === activeSection;

                      return (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => setActiveSection(section.id)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            isActive
                              ? "bg-slate-950 text-white"
                              : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:text-slate-950"
                          }`}
                        >
                          {section.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Live preview</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  Preview the selected public careers page as you edit.
                </h2>
              </div>
              <CareersPreview
                page={{
                  ...careerPage,
                  jobs: previewJobs
                }}
                filters={jobFilters}
                onFilterChange={handleFilterChange}
                jobsState={{
                  loading: dashboardState.loading || jobsStatus.loading,
                  error: jobsStatus.error && !jobsStatus.saving ? jobsStatus.error : ""
                }}
              />
            </section>
          </div>
        </div>
      </main>
      <BottomTabs
        sections={dashboardSections}
        activeSection={activeSection}
        onSelect={setActiveSection}
      />
    </AppShell>
  );
}

