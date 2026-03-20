import { useEffect, useMemo, useState } from "react";
import BottomTabs from "../components/dashboard/BottomTabs";
import DashboardNav from "../components/dashboard/DashboardNav";
import EditorCard from "../components/dashboard/EditorCard";
import CompanyEditor from "../components/dashboard/CompanyEditor";
import SectionsEditor from "../components/dashboard/SectionsEditor";
import JobsEditor from "../components/dashboard/JobsEditor";
import AppShell from "../components/dashboard/AppShell";
import CareersPreview from "../components/preview/CareersPreview";
import { dashboardSections, initialCareerPage } from "../data/careers";
import {
  createCompany,
  createJob,
  fetchCareerPageEditor,
  fetchCareerPageShareLink,
  fetchJobs,
  getErrorMessage,
  publishCareerPage,
  updateCareerPageDraft,
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

function toBuilderState(editorPage, jobs) {
  return {
    company: {
      name: editorPage.company.name || "",
      logo: editorPage.company.logo || ""
    },
    themeSettings: {
      primaryColor: editorPage.careerPage.draft.themeSettings?.primaryColor || "#0f172a",
      secondaryColor: editorPage.careerPage.draft.themeSettings?.secondaryColor || "#475569",
      accentColor: editorPage.careerPage.draft.themeSettings?.accentColor || "#0f766e",
      bannerImageUrl: editorPage.careerPage.draft.themeSettings?.bannerImageUrl || "",
      logoImageUrl: editorPage.careerPage.draft.themeSettings?.logoImageUrl || "",
      logoText: editorPage.careerPage.draft.themeSettings?.logoText || editorPage.company.logo || "",
      cultureVideoUrl: editorPage.careerPage.draft.themeSettings?.cultureVideoUrl || ""
    },
    banner: {
      headline: editorPage.careerPage.draft.banner?.headline || `Careers at ${editorPage.company.name}`,
      subheadline: editorPage.careerPage.draft.banner?.subheadline || editorPage.company.banner || "",
      imageUrl: editorPage.careerPage.draft.banner?.imageUrl || ""
    },
    sections: editorPage.careerPage.draft.sections || [],
    jobs
  };
}

function createEmptyStatus() {
  return {
    saving: false,
    error: "",
    success: ""
  };
}

function BuilderSectionTabs({ sections, activeSection, onSelect }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
      {sections.map((section) => {
        const isActive = section.id === activeSection;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            className={`rounded-[22px] border px-4 py-3 text-left transition ${
              isActive
                ? "border-slate-950 bg-slate-950 text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)]"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">Section</p>
            <p className="mt-1 text-base font-semibold tracking-tight">{section.label}</p>
          </button>
        );
      })}
    </div>
  );
}

function SavePanel({ state, label, onSave }) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white/96 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Publish Flow</p>
          <p className="mt-2 text-base font-semibold tracking-tight text-slate-950">Save current section</p>
          <p className={`mt-2 text-sm leading-6 ${state.error ? "text-rose-600" : state.success ? "text-emerald-600" : "text-slate-500"}`}>
            {state.error || state.success || "Save to sync the current editing panel with the live careers preview."}
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={state.saving}
          className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(180deg,#0f8a8f_0%,#0f6469_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,118,110,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.saving ? "Saving..." : label}
        </button>
      </div>
    </div>
  );
}

function SharePanel({ companySlug, shareState, onShare, onPublish }) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/96 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Ready to Share?</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Public careers link</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Publish the page and copy the public link when you are ready to share it.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto">
          <button
            type="button"
            onClick={onPublish}
            disabled={!companySlug || shareState.loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Publish Page
          </button>
          <button
            type="button"
            onClick={onShare}
            disabled={!companySlug || shareState.loading}
            className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {shareState.loading ? "Preparing..." : "Copy Link"}
          </button>
        </div>
      </div>

      <div className="mt-4 break-all rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {shareState.link || "Your public careers page link will appear here."}
      </div>
      {shareState.message ? <p className="mt-3 text-sm text-slate-500">{shareState.message}</p> : null}
    </section>
  );
}

export default function DashboardPage({ initialCompanySlug = "stripe", onExit }) {
  const [activeSection, setActiveSection] = useState("brand");
  const [careerPage, setCareerPage] = useState(initialCareerPage);
  const [selectedCompanySlug, setSelectedCompanySlug] = useState(initialCompanySlug || "");
  const [companyExists, setCompanyExists] = useState(false);
  const [dashboardState, setDashboardState] = useState({ loading: true, error: "" });
  const [brandStatus, setBrandStatus] = useState(createEmptyStatus());
  const [sectionsStatus, setSectionsStatus] = useState(createEmptyStatus());
  const [rolesStatus, setRolesStatus] = useState({ loading: false, error: "", saving: false, success: "" });
  const [shareState, setShareState] = useState({ loading: false, link: "", message: "" });

  useEffect(() => {
    setSelectedCompanySlug(initialCompanySlug || "");
  }, [initialCompanySlug]);

  useEffect(() => {
    if (!selectedCompanySlug) {
      return;
    }

    let isCancelled = false;

    async function loadBuilder() {
      setDashboardState({ loading: true, error: "" });
      setRolesStatus((current) => ({ ...current, loading: true, error: "", success: "" }));
      setBrandStatus(createEmptyStatus());
      setSectionsStatus(createEmptyStatus());
      setShareState({ loading: false, link: "", message: "" });

      try {
        const [editorPage, jobs] = await Promise.all([
          fetchCareerPageEditor(selectedCompanySlug),
          fetchJobs({ companySlug: selectedCompanySlug })
        ]);

        if (isCancelled) {
          return;
        }

        setCompanyExists(true);
        setCareerPage(toBuilderState(editorPage, jobs));
        setDashboardState({ loading: false, error: "" });
        setRolesStatus((current) => ({ ...current, loading: false, error: "" }));
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setDashboardState({ loading: false, error: getErrorMessage(error, "Failed to load the careers builder.") });
        setRolesStatus((current) => ({ ...current, loading: false, error: getErrorMessage(error, "Failed to load jobs.") }));
      }
    }

    loadBuilder();

    return () => {
      isCancelled = true;
    };
  }, [selectedCompanySlug]);

  const updateCompanyField = (field, value) => {
    setBrandStatus(createEmptyStatus());
    setCareerPage((current) => ({ ...current, company: { ...current.company, [field]: value } }));
  };

  const updateThemeField = (field, value) => {
    setBrandStatus(createEmptyStatus());
    setCareerPage((current) => ({ ...current, themeSettings: { ...current.themeSettings, [field]: value } }));
  };

  const updateBannerField = (field, value) => {
    setBrandStatus(createEmptyStatus());
    setCareerPage((current) => ({ ...current, banner: { ...current.banner, [field]: value } }));
  };

  const updateSections = (sections) => {
    setSectionsStatus(createEmptyStatus());
    setCareerPage((current) => ({ ...current, sections }));
  };

  const updateJobField = (jobId, field, value) => {
    setRolesStatus((current) => ({ ...current, error: "", success: "" }));
    setCareerPage((current) => ({
      ...current,
      jobs: current.jobs.map((job) => (job.id === jobId ? { ...job, [field]: value } : job))
    }));
  };

  const addJobDraft = () => {
    setRolesStatus((current) => ({ ...current, error: "", success: "" }));
    setCareerPage((current) => ({ ...current, jobs: [...current.jobs, createDraftJob(current.jobs.length + 1)] }));
    setActiveSection("roles");
  };

  const persistCompany = async () => {
    const aboutSection = careerPage.sections.find((section) => section.type === "about_us");
    const payload = {
      name: careerPage.company.name,
      logo: careerPage.themeSettings.logoText || careerPage.company.logo,
      banner: careerPage.banner.subheadline,
      about: aboutSection?.content?.body || ""
    };

    const savedCompany = companyExists
      ? await updateCompany(selectedCompanySlug, payload)
      : await createCompany(payload);

    setSelectedCompanySlug(savedCompany.slug);
    setCompanyExists(true);
    setCareerPage((current) => ({
      ...current,
      company: {
        ...current.company,
        name: savedCompany.name || current.company.name,
        logo: savedCompany.logo || current.company.logo
      }
    }));

    return savedCompany;
  };

  const persistDraft = async (slug) => {
    const draft = await updateCareerPageDraft(slug, {
      themeSettings: careerPage.themeSettings,
      banner: careerPage.banner,
      sections: careerPage.sections
    });

    setCareerPage((current) => ({
      ...current,
      themeSettings: {
        ...current.themeSettings,
        ...draft.careerPage.draft.themeSettings
      },
      banner: {
        ...current.banner,
        ...draft.careerPage.draft.banner
      },
      sections: draft.careerPage.draft.sections
    }));

    return draft;
  };

  const saveBrand = async () => {
    setBrandStatus({ saving: true, error: "", success: "" });
    try {
      const savedCompany = await persistCompany();
      await persistDraft(savedCompany.slug);
      setBrandStatus({ saving: false, error: "", success: "Brand theme saved." });
    } catch (error) {
      setBrandStatus({ saving: false, error: getErrorMessage(error, "Failed to save brand theme."), success: "" });
    }
  };

  const saveSections = async () => {
    setSectionsStatus({ saving: true, error: "", success: "" });
    try {
      const savedCompany = await persistCompany();
      await persistDraft(savedCompany.slug);
      setSectionsStatus({ saving: false, error: "", success: "Sections saved." });
    } catch (error) {
      setSectionsStatus({ saving: false, error: getErrorMessage(error, "Failed to save sections."), success: "" });
    }
  };

  const saveRoles = async () => {
    setRolesStatus((current) => ({ ...current, saving: true, error: "", success: "" }));
    try {
      const savedCompany = await persistCompany();
      await persistDraft(savedCompany.slug);
      const savedJobs = await Promise.all(
        careerPage.jobs.map((job) => {
          const payload = { title: job.title, location: job.location, type: job.type, summary: job.summary };
          return job.id.startsWith("draft-") ? createJob(savedCompany.slug, payload) : updateJob(job.id, payload);
        })
      );
      setCareerPage((current) => ({ ...current, jobs: savedJobs }));
      setRolesStatus((current) => ({ ...current, loading: false, saving: false, error: "", success: "Roles saved." }));
    } catch (error) {
      setRolesStatus((current) => ({ ...current, saving: false, error: getErrorMessage(error, "Failed to save job listings."), success: "" }));
    }
  };

  const copyShareLink = async () => {
    if (!selectedCompanySlug) return;
    setShareState((current) => ({ ...current, loading: true, message: "" }));
    try {
      const share = await fetchCareerPageShareLink(selectedCompanySlug);
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(share.shareUrl);
      }
      setShareState({ loading: false, link: share.shareUrl, message: share.isPublished ? "Link copied and ready to share." : "Draft link copied successfully." });
    } catch (error) {
      setShareState((current) => ({ ...current, loading: false, message: getErrorMessage(error, "Unable to copy the careers link right now.") }));
    }
  };

  const publishPage = async () => {
    if (!selectedCompanySlug) return;
    setShareState((current) => ({ ...current, loading: true, message: "" }));
    try {
      await persistCompany();
      await persistDraft(selectedCompanySlug);
      const published = await publishCareerPage(selectedCompanySlug);
      setShareState({ loading: false, link: published.careerPage.shareUrl, message: "Careers page published successfully." });
    } catch (error) {
      setShareState((current) => ({ ...current, loading: false, message: getErrorMessage(error, "Unable to publish the careers page right now.") }));
    }
  };

  const sectionMeta = useMemo(() => ({
    brand: {
      eyebrow: "Brand Theme",
      title: "Set the company look and feel",
      description: "Control colors, banner presentation, logo appearance, and culture-video metadata from one panel.",
      saveLabel: "Save Brand",
      state: brandStatus,
      onSave: saveBrand,
      content: <CompanyEditor company={careerPage.company} themeSettings={careerPage.themeSettings} banner={careerPage.banner} selectedSlug={selectedCompanySlug} onCompanyChange={updateCompanyField} onThemeChange={updateThemeField} onBannerChange={updateBannerField} />
    },
    sections: {
      eyebrow: "Content Sections",
      title: "Add, remove, and reorder sections",
      description: "Control the structure of the careers page and customize the content shown in each section.",
      saveLabel: "Save Sections",
      state: sectionsStatus,
      onSave: saveSections,
      content: <SectionsEditor sections={careerPage.sections} onChange={updateSections} />
    },
    roles: {
      eyebrow: "Open Roles",
      title: "Manage live job listings",
      description: "Choose whether to add a new role or edit an existing one, then preview the result immediately.",
      saveLabel: "Save Roles",
      state: rolesStatus,
      onSave: saveRoles,
      content: <JobsEditor jobs={careerPage.jobs} onUpdateJob={updateJobField} onAddJob={addJobDraft} />
    }
  }), [brandStatus, sectionsStatus, rolesStatus, careerPage, selectedCompanySlug]);

  const activeSectionMeta = sectionMeta[activeSection];
  const activeSectionLabel = dashboardSections.find((section) => section.id === activeSection)?.label || "Builder";

  return (
    <AppShell>
      <DashboardNav companyName={careerPage.company.name} activeSectionLabel={activeSectionLabel} saveLabel={activeSectionMeta.saveLabel} saveState={activeSectionMeta.state} onSave={activeSectionMeta.onSave} onExit={onExit} />
      <main className="mx-auto max-w-[110rem] overflow-x-clip px-4 pb-28 pt-5 sm:px-6 lg:px-8 xl:pb-12 xl:pt-6">
        {dashboardState.error ? <div className="mb-6 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">{dashboardState.error}</div> : null}

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.12fr)_27rem] xl:items-start">
          <section className="order-2 min-w-0 space-y-4 xl:order-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Live Preview</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Preview the public careers page as you build it.</h2>
            </div>
            <div className="hide-scrollbar xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto xl:pr-2"><CareersPreview page={careerPage} jobsState={{ loading: dashboardState.loading || rolesStatus.loading, error: rolesStatus.error && !rolesStatus.saving ? rolesStatus.error : "" }} /></div>
          </section>

          <aside className="order-1 min-w-0 xl:order-2">
            <div className="hide-scrollbar space-y-5 xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto xl:pr-2">
              <section className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,#0f767d_0%,#0b5a5f_100%)] p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] sm:p-6">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/80">Visual Builder</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">Edit the page structure</h2>
                  <p className="mt-2 text-sm leading-6 text-teal-50/80">Move through the builder sections and keep the preview visible while you work.</p>
                </div>
                <BuilderSectionTabs sections={dashboardSections} activeSection={activeSection} onSelect={setActiveSection} />
              </section>

              <SharePanel companySlug={selectedCompanySlug} shareState={shareState} onShare={copyShareLink} onPublish={publishPage} />

              {dashboardState.loading ? (
                <div className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-12 text-sm text-slate-500 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">Loading builder...</div>
              ) : (
                <>
                  <EditorCard eyebrow={activeSectionMeta.eyebrow} title={activeSectionMeta.title} description={activeSectionMeta.description}>{activeSectionMeta.content}</EditorCard>
                  <SavePanel state={activeSectionMeta.state} label={activeSectionMeta.saveLabel} onSave={activeSectionMeta.onSave} />
                </>
              )}
            </div>
          </aside>
        </div>
      </main>
      <BottomTabs sections={dashboardSections} activeSection={activeSection} onSelect={setActiveSection} />
    </AppShell>
  );
}

