import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faFloppyDisk,
  faLink,
  faPaperPlane,
  faShareNodes,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import CompanyEditor from "../components/dashboard/CompanyEditor";
import SectionsEditor from "../components/dashboard/SectionsEditor";
import JobsEditor from "../components/dashboard/JobsEditor";
import AppShell from "../components/dashboard/AppShell";
import CareersPreview from "../components/preview/CareersPreview";
import { DashboardPanelSkeleton } from "../components/Skeleton";
import { dashboardSections, initialCareerPage } from "../data/careers";
import {
  createCompany,
  createJob,
  deleteJob,
  fetchCareerPageEditor,
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
      mode: editorPage.careerPage.draft.themeSettings?.mode || "light",
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

function isDraftJob(job) {
  return typeof job?.id === "string" && job.id.startsWith("draft-");
}

function hasUnpublishedDraftChanges(editorPage) {
  if (!editorPage?.careerPage?.published) {
    return false;
  }

  return JSON.stringify({
    themeSettings: editorPage.careerPage.draft.themeSettings,
    banner: editorPage.careerPage.draft.banner,
    sections: editorPage.careerPage.draft.sections
  }) !== JSON.stringify({
    themeSettings: editorPage.careerPage.published.themeSettings,
    banner: editorPage.careerPage.published.banner,
    sections: editorPage.careerPage.published.sections
  });
}

function createPublishedState(editorPage, jobs) {
  const published = editorPage?.careerPage?.published;

  if (!published) {
    return toBuilderState(editorPage, jobs);
  }

  return {
    company: {
      name: editorPage.company.name || "",
      logo: editorPage.company.logo || ""
    },
    themeSettings: published.themeSettings || {},
    banner: published.banner || {},
    sections: published.sections || [],
    jobs
  };
}

function buildPublicCareerUrl(slug) {
  if (!slug || typeof window === "undefined") {
    return "";
  }

  return `${window.location.origin}/careers/${slug}`;
}

function DraftPrompt({ open, onContinue, onClear, loading }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" className="absolute inset-0 bg-slate-950/30" onClick={onContinue} aria-label="Continue with draft" />
      <div className="relative w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Draft found</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Continue editing your draft?</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">You have unpublished changes in the editor. Continue with that draft or clear it and start from the currently published version.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue with draft
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-60"
          >
            {loading ? "Clearing..." : "Clear draft"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BuilderTabs({ sections, activeSection, onSelect, className = "", compact = false }) {
  const containerClasses = compact
    ? "flex min-h-12 items-center gap-6 border-b border-slate-200/80 bg-white px-4 py-2"
    : "hide-scrollbar flex gap-2 overflow-x-auto border-b border-slate-200/80 bg-white px-4 py-3 sm:px-6 lg:px-8";

  const buttonClasses = compact ? "border-b-2 px-1.5 py-2 leading-6" : "border-b-2 px-1.5 pb-2 pt-1";

  return (
    <div className={`${containerClasses} ${className}`.trim()}>
      {sections.map((section) => {
        const isActive = section.id === activeSection;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            className={`${buttonClasses} shrink-0 whitespace-nowrap text-sm font-medium transition ${
              isActive
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            {section.label}
          </button>
        );
      })}
    </div>
  );
}

function formatCompanyLabel(slug, companyName) {
  if (companyName) return companyName;
  if (!slug) return "Company";
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function BuilderHeader({ companyName, companySlug, onOpenSaveMenu, onOpenShareSheet }) {
  return (
    <header className="border-b border-slate-200/80 bg-white px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-700">{formatCompanyLabel(companySlug, companyName)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSaveMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
            aria-label="Open save options"
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
          </button>
          <button
            type="button"
            onClick={onOpenShareSheet}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
            aria-label="Open share options"
          >
            <FontAwesomeIcon icon={faShareNodes} />
          </button>
        </div>
      </div>
    </header>
  );
}

function SaveMenu({ open, onClose, onSaveDraft, onSave, loading }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-slate-950/20" onClick={onClose} aria-label="Close save menu" />
      <div className="absolute right-4 top-16 w-48 rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.18)] sm:right-6 lg:right-8">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={loading}
          className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <FontAwesomeIcon icon={faFloppyDisk} />
          <span>Save Draft</span>
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={loading}
          className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <FontAwesomeIcon icon={faCheck} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}

function ShareSheet({ open, link, message, loading, onClose, onCopy, onNativeShare }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-slate-950/20" onClick={onClose} aria-label="Close share sheet" />
      <div className="absolute right-4 top-16 w-[20rem] rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.18)] sm:right-6 lg:right-8">
        <div className="flex items-start justify-between gap-4 px-1 pb-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">Share careers page</p>
            <p className="mt-1 text-sm text-slate-500">Choose how you want to share this link.</p>
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="break-all rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {link || "Preparing your careers page link..."}
        </div>

        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={onCopy}
            disabled={loading}
            className="flex w-full items-center gap-3 rounded-[16px] px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <FontAwesomeIcon icon={faLink} />
            <span>Copy link</span>
          </button>
          <button
            type="button"
            onClick={onNativeShare}
            disabled={loading}
            className="flex w-full items-center gap-3 rounded-[16px] px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>Share with apps</span>
          </button>
        </div>

        {message ? <p className="px-1 pt-3 text-sm text-slate-500">{message}</p> : null}
      </div>
    </div>
  );
}

export default function DashboardPage({ initialCompanySlug = "stripe", initialSection = "brand", onSectionChange, onExit }) {
  const [activeSection, setActiveSection] = useState(initialSection || "brand");
  const [careerPage, setCareerPage] = useState(initialCareerPage);
  const [selectedCompanySlug, setSelectedCompanySlug] = useState(initialCompanySlug || "");
  const [companyExists, setCompanyExists] = useState(false);
  const [dashboardState, setDashboardState] = useState({ loading: true, error: "" });
  const [brandStatus, setBrandStatus] = useState(createEmptyStatus());
  const [sectionsStatus, setSectionsStatus] = useState(createEmptyStatus());
  const [shareState, setShareState] = useState({ loading: false, link: "", message: "" });
  const [isSaveMenuOpen, setIsSaveMenuOpen] = useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [draftPromptState, setDraftPromptState] = useState({ open: false, clearing: false, publishedState: null });
  const [deletedJobIds, setDeletedJobIds] = useState([]);

  useEffect(() => {
    setSelectedCompanySlug(initialCompanySlug || "");
  }, [initialCompanySlug]);

  useEffect(() => {
    setActiveSection(initialSection || "brand");
  }, [initialSection]);

  const selectSection = (section) => {
    setActiveSection(section);
    onSectionChange?.(section);
  };

  useEffect(() => {
    if (!selectedCompanySlug) {
      return;
    }

    let isCancelled = false;

    async function loadBuilder() {
      setDashboardState({ loading: true, error: "" });
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
        setDeletedJobIds([]);
        setDraftPromptState({
          open: hasUnpublishedDraftChanges(editorPage),
          clearing: false,
          publishedState: createPublishedState(editorPage, jobs)
        });
        setDashboardState({ loading: false, error: "" });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setDashboardState({ loading: false, error: getErrorMessage(error, "Failed to load the careers builder.") });
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
    setSectionsStatus(createEmptyStatus());
    setCareerPage((current) => ({
      ...current,
      jobs: current.jobs.map((job) => (job.id === jobId ? { ...job, [field]: value } : job))
    }));
  };

  const addJobDraft = () => {
    setSectionsStatus(createEmptyStatus());
    setCareerPage((current) => ({ ...current, jobs: [...current.jobs, createDraftJob(current.jobs.length + 1)] }));
    selectSection("sections");
  };

  const removeJobDraft = (jobId) => {
    setSectionsStatus(createEmptyStatus());
    setCareerPage((current) => ({
      ...current,
      jobs: current.jobs.filter((job) => job.id !== jobId)
    }));

    if (!isDraftJob({ id: jobId })) {
      setDeletedJobIds((current) => (current.includes(jobId) ? current : [...current, jobId]));
    }
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

  const setEditorStatuses = (status) => {
    setBrandStatus(status);
    setSectionsStatus(status);
  };

  const persistPublishedJobs = async (slug) => {
    await Promise.all(
      careerPage.jobs.map((job) => {
        const payload = { title: job.title, location: job.location, type: job.type, summary: job.summary };
        return isDraftJob(job) ? createJob(slug, payload) : updateJob(job.id, payload);
      })
    );

    if (deletedJobIds.length > 0) {
      await Promise.all(deletedJobIds.map((jobId) => deleteJob(jobId)));
      setDeletedJobIds([]);
    }

    const refreshedJobs = await fetchJobs({ companySlug: slug });
    setCareerPage((current) => ({ ...current, jobs: refreshedJobs }));
    return refreshedJobs;
  };

  const saveDraftOnly = async () => {
    setEditorStatuses({ saving: true, error: "", success: "" });

    try {
      const savedCompany = await persistCompany();
      await persistDraft(savedCompany.slug);
      setEditorStatuses({ saving: false, error: "", success: "Draft saved." });
    } catch (error) {
      setEditorStatuses({ saving: false, error: getErrorMessage(error, "Failed to save draft."), success: "" });
      throw error;
    }
  };

  const saveAndPublish = async () => {
    setEditorStatuses({ saving: true, error: "", success: "" });

    try {
      const savedCompany = await persistCompany();
      await persistDraft(savedCompany.slug);
      await persistPublishedJobs(savedCompany.slug);
      await publishCareerPage(savedCompany.slug);
      setDraftPromptState({ open: false, clearing: false, publishedState: null });
      setEditorStatuses({ saving: false, error: "", success: "Changes published." });
    } catch (error) {
      setEditorStatuses({ saving: false, error: getErrorMessage(error, "Failed to publish changes."), success: "" });
      throw error;
    }
  };

  const clearDraft = async () => {
    if (!selectedCompanySlug || !draftPromptState.publishedState) {
      setDraftPromptState({ open: false, clearing: false, publishedState: null });
      return;
    }

    setDraftPromptState((current) => ({ ...current, clearing: true }));

    try {
      const restored = draftPromptState.publishedState;
      await updateCareerPageDraft(selectedCompanySlug, {
        themeSettings: restored.themeSettings,
        banner: restored.banner,
        sections: restored.sections
      });
      setCareerPage(restored);
      setDeletedJobIds([]);
      setEditorStatuses({ saving: false, error: "", success: "Draft cleared." });
      setDraftPromptState({ open: false, clearing: false, publishedState: null });
    } catch (error) {
      setEditorStatuses({ saving: false, error: getErrorMessage(error, "Failed to clear draft."), success: "" });
      setDraftPromptState((current) => ({ ...current, clearing: false }));
    }
  };

  const copyShareLink = async () => {
    if (!selectedCompanySlug) return;
    const readyLink = shareState.link || buildPublicCareerUrl(selectedCompanySlug);
    setShareState((current) => ({ ...current, loading: true, message: "", link: readyLink || current.link }));
    try {
      const link = readyLink || await ensurePublishedShareLink();
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      }
      setShareState((current) => ({ ...current, loading: false, link, message: "Link copied successfully." }));
    } catch (error) {
      setShareState((current) => ({ ...current, loading: false, message: getErrorMessage(error, "Unable to copy the careers link right now.") }));
    }
  };

  const nativeShareLink = async () => {
    if (!selectedCompanySlug) return;
    const readyLink = shareState.link || buildPublicCareerUrl(selectedCompanySlug);
    setShareState((current) => ({ ...current, loading: true, message: "", link: readyLink || current.link }));
    try {
      const link = readyLink || await ensurePublishedShareLink();
      if (navigator.share) {
        await navigator.share({ title: `${careerPage.company.name} Careers`, url: link });
        setShareState((current) => ({ ...current, loading: false, link, message: "Shared successfully." }));
      } else {
        await copyShareLink();
      }
    } catch (error) {
      setShareState((current) => ({ ...current, loading: false, message: getErrorMessage(error, "Unable to open share options right now.") }));
    }
  };

  const ensurePublishedShareLink = async () => {
    const savedCompany = await persistCompany();
    await persistDraft(savedCompany.slug);
    await persistPublishedJobs(savedCompany.slug);
    const published = await publishCareerPage(savedCompany.slug);
    const link = published.careerPage.shareUrl;
    setDraftPromptState({ open: false, clearing: false, publishedState: null });
    setShareState((current) => ({ ...current, link }));
    return link;
  };

  const openShareSheet = async () => {
    setIsShareSheetOpen(true);

    if (!selectedCompanySlug) {
      return;
    }

    const readyLink = buildPublicCareerUrl(selectedCompanySlug);
    setShareState((current) => ({ ...current, link: current.link || readyLink, message: "" }));
  };

  const saveOnly = async () => {
    await saveAndPublish();
    setIsSaveMenuOpen(false);
  };

  const sectionMeta = useMemo(() => ({
    brand: {
      eyebrow: "Brand Theme",
      title: "Set the company look and feel",
      description: "Control colors, banner presentation, logo appearance, and culture-video metadata from one panel.",
      saveLabel: "Save Draft",
      state: brandStatus,
      onSave: saveDraftOnly,
      content: <CompanyEditor company={careerPage.company} themeSettings={careerPage.themeSettings} banner={careerPage.banner} selectedSlug={selectedCompanySlug} onCompanyChange={updateCompanyField} onThemeChange={updateThemeField} onBannerChange={updateBannerField} />
    },
    sections: {
      eyebrow: "Content Sections",
      title: "Build the page structure",
      description: "Manage visible sections first, then configure the job roles that power the Open Roles experience.",
      saveLabel: "Save Draft",
      state: sectionsStatus,
      onSave: saveDraftOnly,
      content: (
        <div className="space-y-6">
          <SectionsEditor sections={careerPage.sections} selectedSlug={selectedCompanySlug} onChange={updateSections} />
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Job Roles</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">Add or edit job roles</h3>
            </div>
            <JobsEditor jobs={careerPage.jobs} onUpdateJob={updateJobField} onAddJob={addJobDraft} onDeleteJob={removeJobDraft} />
          </div>
        </div>
      )
    },
    preview: {
      eyebrow: "Preview",
      title: "Review the final page",
      description: "Use the live preview to validate the careers experience before you publish or share it.",
      saveLabel: "Save Draft",
      state: sectionsStatus,
      onSave: saveDraftOnly,
      content: null
    }
  }), [brandStatus, sectionsStatus, careerPage, selectedCompanySlug]);

  const activeSectionMeta = sectionMeta[activeSection];
  const desktopSections = dashboardSections.filter((section) => section.id !== "preview");

  return (
    <AppShell>
      <div className="xl:flex xl:h-screen xl:flex-col xl:overflow-hidden">
        <BuilderHeader companyName={careerPage.company.name} companySlug={selectedCompanySlug || initialCompanySlug} onOpenSaveMenu={() => setIsSaveMenuOpen(true)} onOpenShareSheet={openShareSheet} />
        <BuilderTabs sections={dashboardSections} activeSection={activeSection} onSelect={selectSection} className="xl:hidden" />

        <main className="mx-auto max-w-[110rem] overflow-x-clip px-4 pb-10 pt-5 sm:px-6 lg:px-8 xl:h-[calc(100vh-4.5rem)] xl:min-h-0 xl:flex-1 xl:overflow-hidden xl:pb-6 xl:pt-6">
          {dashboardState.error ? <div className="mb-6 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">{dashboardState.error}</div> : null}

          <div className="grid min-w-0 gap-6 xl:h-full xl:min-h-0 xl:grid-cols-[minmax(0,1.12fr)_27rem] xl:items-stretch">
            <section className={`min-w-0 space-y-4 ${activeSection === "preview" ? "order-1" : "order-2 xl:order-1"} ${activeSection !== "preview" ? "hidden xl:flex" : "block"} xl:min-h-0 xl:h-full xl:flex-col`}>
              <div className="hidden xl:block">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Live Preview</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Preview the public careers page as you build it.</h2>
              </div>
              <div className="hide-scrollbar xl:min-h-0 xl:h-full xl:flex-1 xl:overflow-y-auto xl:pr-2">
                <CareersPreview page={careerPage} jobsState={{ loading: dashboardState.loading, error: "" }} />
              </div>
            </section>

            <aside className={`min-w-0 ${activeSection === "preview" ? "hidden xl:block" : "block"} order-1 xl:min-h-0 xl:h-full`}>
              <div className="hide-scrollbar space-y-5 xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:overflow-y-auto xl:pr-2">
                <BuilderTabs sections={desktopSections} activeSection={activeSection} onSelect={selectSection} compact className="hidden xl:flex xl:sticky xl:top-0 xl:z-10 xl:w-full xl:px-0" />
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">{activeSectionMeta.eyebrow}</p>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{activeSectionMeta.title}</h2>
                    <p className="text-sm leading-6 text-slate-500">{activeSectionMeta.description}</p>
                  </div>
                  {activeSectionMeta.state.error ? (
                    <div className="rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{activeSectionMeta.state.error}</div>
                  ) : null}
                  {activeSectionMeta.state.success ? (
                    <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{activeSectionMeta.state.success}</div>
                  ) : null}
                  {dashboardState.loading ? <DashboardPanelSkeleton section={activeSection} /> : activeSectionMeta.content}
                </div>
              </div>
            </aside>
          </div>
        </main>

        <SaveMenu open={isSaveMenuOpen} onClose={() => setIsSaveMenuOpen(false)} onSaveDraft={async () => { await saveDraftOnly(); setIsSaveMenuOpen(false); }} onSave={saveOnly} loading={brandStatus.saving || sectionsStatus.saving || shareState.loading} />
        <ShareSheet open={isShareSheetOpen} link={shareState.link} message={shareState.message} loading={shareState.loading} onClose={() => setIsShareSheetOpen(false)} onCopy={copyShareLink} onNativeShare={nativeShareLink} />
        <DraftPrompt open={draftPromptState.open} loading={draftPromptState.clearing} onContinue={() => setDraftPromptState((current) => ({ ...current, open: false }))} onClear={clearDraft} />
      </div>
    </AppShell>
  );
}


