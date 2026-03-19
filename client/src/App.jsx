import { useState } from "react";
import BottomTabs from "./components/dashboard/BottomTabs";
import DashboardNav from "./components/dashboard/DashboardNav";
import DashboardSidebar from "./components/dashboard/DashboardSidebar";
import EditorCard from "./components/dashboard/EditorCard";
import CompanyEditor from "./components/dashboard/CompanyEditor";
import AboutEditor from "./components/dashboard/AboutEditor";
import JobsEditor from "./components/dashboard/JobsEditor";
import AppShell from "./components/dashboard/AppShell";
import CareersPreview from "./components/preview/CareersPreview";
import { dashboardSections, initialCareerPage } from "./data/careers";

function getNewJob(index) {
  return {
    id: `job-${index}`,
    title: "New Role",
    location: "Remote",
    type: "Full-time",
    summary: "Add a short summary for this new position."
  };
}

export default function App() {
  const [activeSection, setActiveSection] = useState("company");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [careerPage, setCareerPage] = useState(initialCareerPage);

  const updateCompanyField = (field, value) => {
    setCareerPage((current) => ({
      ...current,
      company: {
        ...current.company,
        [field]: value
      }
    }));
  };

  const updateAbout = (value) => {
    setCareerPage((current) => ({
      ...current,
      about: value
    }));
  };

  const updateJob = (jobId, field, value) => {
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

  const addJob = () => {
    setCareerPage((current) => ({
      ...current,
      jobs: [...current.jobs, getNewJob(current.jobs.length + 1)]
    }));
    setActiveSection("jobs");
  };

  return (
    <AppShell>
      <DashboardNav />
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
            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                {activeSection === "company" && (
                  <EditorCard
                    title="Company details"
                    description="Update the company identity and banner content shown in the hero section."
                  >
                    <CompanyEditor company={careerPage.company} onChange={updateCompanyField} />
                  </EditorCard>
                )}

                {activeSection === "about" && (
                  <EditorCard
                    title="About section"
                    description="Refine the story candidates read before they explore open roles."
                  >
                    <AboutEditor value={careerPage.about} onChange={updateAbout} />
                  </EditorCard>
                )}

                {activeSection === "jobs" && (
                  <EditorCard
                    title="Job listings"
                    description="Add and edit open roles. Every change appears in the preview instantly."
                  >
                    <JobsEditor
                      jobs={careerPage.jobs}
                      onUpdateJob={updateJob}
                      onAddJob={addJob}
                    />
                  </EditorCard>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <p className="text-sm font-semibold text-slate-950">Editing focus</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Use the navigation to jump between sections. The preview below reflects every field in real time.
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
                  Preview the public careers page as you edit.
                </h2>
              </div>
              <CareersPreview page={careerPage} />
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
