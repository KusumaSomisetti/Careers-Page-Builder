import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/dashboard/AppShell";
import BrandMark from "../components/BrandMark";
import {
  fetchCareerPageEditor,
  fetchCareerPageShareLink,
  fetchJobs,
  getErrorMessage
} from "../services/api";

const lifeGallery = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"
];

const roleGallery = [
  "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"
];

function MenuIcon() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.10)]">
      <div className="space-y-1.5">
        <div className="h-0.5 w-5 rounded-full bg-slate-800" />
        <div className="h-0.5 w-5 rounded-full bg-slate-800" />
        <div className="h-0.5 w-5 rounded-full bg-slate-800" />
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <div className="relative h-5 w-5">
      <div className="absolute left-0 top-3 h-0.5 w-4 rounded-full bg-current" />
      <div className="absolute right-0 top-0 h-3 w-3 rotate-45 rounded-sm border-2 border-current border-l-0 border-b-0" />
    </div>
  );
}

function ShareIcon() {
  return (
    <div className="relative h-5 w-5">
      <div className="absolute left-0 top-2.5 h-0.5 w-3 rounded-full bg-current" />
      <div className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-current" />
      <div className="absolute left-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-current" />
    </div>
  );
}

function TopAction({ onClick, children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/92 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.10)] transition hover:-translate-y-0.5 hover:text-slate-950"
    >
      {children}
    </button>
  );
}

function JobCard({ job, imageUrl }) {
  return (
    <article className="min-w-[170px] overflow-hidden rounded-[22px] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.10)]">
      <img src={imageUrl} alt="Role" className="h-28 w-full object-cover" />
      <div className="space-y-3 px-4 py-4">
        <h3 className="text-[1.05rem] font-semibold leading-5 tracking-tight text-slate-950">
          {job.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-400" />
          <span>{job.location}</span>
        </div>
      </div>
    </article>
  );
}

function SectionBlock({ title, children }) {
  return (
    <section className="space-y-4 px-6 py-1 sm:px-8">
      <h2 className="text-[2.1rem] font-semibold tracking-tight text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

export default function RecruiterCompanyViewPage({ companySlug, onBack, onEdit }) {
  const [state, setState] = useState({ loading: true, error: "", shareMessage: "" });
  const [page, setPage] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!companySlug) {
      return;
    }

    let isCancelled = false;

    async function loadCompanyView() {
      setState({ loading: true, error: "", shareMessage: "" });

      try {
        const [editorPage, companyJobs] = await Promise.all([
          fetchCareerPageEditor(companySlug),
          fetchJobs({ companySlug })
        ]);

        if (isCancelled) {
          return;
        }

        setPage(editorPage);
        setJobs(companyJobs);
        setState({ loading: false, error: "", shareMessage: "" });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setState({
          loading: false,
          error: getErrorMessage(error, "Failed to load recruiter company view."),
          shareMessage: ""
        });
      }
    }

    loadCompanyView();

    return () => {
      isCancelled = true;
    };
  }, [companySlug]);

  const visibleSections = useMemo(() => {
    return page?.careerPage?.draft?.sections?.filter((section) => section.isVisible) || [];
  }, [page]);

  const theme = page?.careerPage?.draft?.themeSettings || {};
  const banner = page?.careerPage?.draft?.banner || {};
  const accentColor = theme.accentColor || "#0f766e";
  const primaryColor = theme.primaryColor || "#0f172a";
  const heroImage = theme.bannerImageUrl || banner.imageUrl || lifeGallery[0];

  const aboutSection = visibleSections.find((section) => section.type === "about_us");
  const lifeSection = visibleSections.find((section) => section.type === "life_at_company");
  const openRolesSection = visibleSections.find((section) => section.type === "open_roles");

  const handleShare = async () => {
    try {
      const share = await fetchCareerPageShareLink(companySlug);
      if (navigator.share) {
        await navigator.share({
          title: `${page.company.name} Careers`,
          url: share.shareUrl
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(share.shareUrl);
      }

      setState((current) => ({
        ...current,
        shareMessage: share.isPublished ? "Public careers link ready to share." : "Draft link copied. Publish when ready."
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        shareMessage: getErrorMessage(error, "Unable to share the careers link right now.")
      }));
    }
  };

  return (
    <AppShell>
      <main className="mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[28rem] lg:max-w-5xl lg:pt-6">
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={onBack}
              className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
            >
              Back
            </button>
            <div className="rounded-full bg-white/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.10)]">
              Recruiter View
            </div>
          </div>

          {state.error ? (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {state.error}
            </div>
          ) : null}

          {state.loading ? (
            <div className="rounded-[34px] border border-slate-200/80 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              Loading company careers page...
            </div>
          ) : page ? (
            <div className="rounded-[40px] border border-slate-200/80 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(241,245,249,0.92))] shadow-[0_28px_80px_rgba(15,23,42,0.12)] lg:grid lg:grid-cols-[minmax(0,430px)_1fr] lg:overflow-hidden">
              <div className="hidden border-r border-slate-200/70 bg-white/55 p-8 lg:flex lg:flex-col lg:justify-between">
                <div>
                  <div className="flex items-center gap-4">
                    <BrandMark />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Recruiter View</p>
                      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{page.company.name}</p>
                    </div>
                  </div>
                  <p className="mt-6 text-base leading-8 text-slate-600">
                    Review the draft careers page exactly as your candidates would experience it, then enter edit mode when you are ready to make changes.
                  </p>
                </div>
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => onEdit(companySlug)}
                    className="inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(15,118,110,0.32)]"
                    style={{ background: `linear-gradient(180deg, ${accentColor}, ${primaryColor})` }}
                  >
                    Edit careers page
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                  >
                    Share careers link
                  </button>
                  {state.shareMessage ? <p className="text-sm text-slate-500">{state.shareMessage}</p> : null}
                </div>
              </div>

              <div className="mx-auto w-full max-w-[28rem] rounded-[36px] bg-white pb-8 pt-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] lg:max-w-none lg:rounded-none lg:shadow-none">
                <div className="px-5 pb-4 sm:px-6 lg:hidden">
                  <div className="flex items-center justify-between">
                    <MenuIcon />
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                      {theme.logoImageUrl ? (
                        <img src={theme.logoImageUrl} alt={page.company.name} className="h-8 w-8 rounded-xl object-cover" />
                      ) : theme.logoText || page.company.logo ? (
                        <span className="text-lg font-semibold" style={{ color: accentColor }}>
                          {theme.logoText || page.company.logo}
                        </span>
                      ) : (
                        <BrandMark />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <TopAction onClick={handleShare} label="Share careers link">
                        <ShareIcon />
                      </TopAction>
                      <TopAction onClick={() => onEdit(companySlug)} label="Edit careers page">
                        <EditIcon />
                      </TopAction>
                    </div>
                  </div>
                  {state.shareMessage ? <p className="mt-3 text-center text-sm text-slate-500">{state.shareMessage}</p> : null}
                </div>

                <div className="hidden border-b border-slate-200/80 px-8 pb-5 lg:flex lg:items-center lg:justify-between">
                  <div className="flex items-center gap-4">
                    <MenuIcon />
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                      {theme.logoImageUrl ? (
                        <img src={theme.logoImageUrl} alt={page.company.name} className="h-8 w-8 rounded-xl object-cover" />
                      ) : theme.logoText || page.company.logo ? (
                        <span className="text-lg font-semibold" style={{ color: accentColor }}>
                          {theme.logoText || page.company.logo}
                        </span>
                      ) : (
                        <BrandMark />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TopAction onClick={handleShare} label="Share careers link">
                      <ShareIcon />
                    </TopAction>
                    <TopAction onClick={() => onEdit(companySlug)} label="Edit careers page">
                      <EditIcon />
                    </TopAction>
                  </div>
                </div>

                <img src={heroImage} alt={`${page.company.name} team`} className="h-72 w-full object-cover sm:h-80 lg:h-[22rem]" />

                <div className="space-y-10 pt-8">
                  {aboutSection ? (
                    <SectionBlock title={aboutSection.title}>
                      <p className="max-w-2xl text-[1.15rem] leading-9 text-slate-700">
                        {aboutSection.content?.body || page.company.about || banner.subheadline}
                      </p>
                    </SectionBlock>
                  ) : null}

                  {lifeSection ? (
                    <SectionBlock title={lifeSection.title}>
                      <div className="grid grid-cols-3 gap-3">
                        {lifeGallery.map((imageUrl, index) => (
                          <div key={imageUrl} className="overflow-hidden rounded-[16px] bg-slate-100 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
                            <img src={imageUrl} alt={`Life at company ${index + 1}`} className="h-24 w-full object-cover sm:h-28" />
                          </div>
                        ))}
                      </div>
                    </SectionBlock>
                  ) : null}

                  {openRolesSection ? (
                    <SectionBlock title={openRolesSection.title}>
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {jobs.slice(0, 6).map((job, index) => (
                          <JobCard key={job.id} job={job} imageUrl={roleGallery[index % roleGallery.length]} />
                        ))}
                      </div>
                    </SectionBlock>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </AppShell>
  );
}
