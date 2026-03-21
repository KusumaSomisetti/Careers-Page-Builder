import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/dashboard/AppShell";
import CareersPageView from "../components/careers/CareersPageView";
import { fetchCareerPageEditor, fetchJobs, getErrorMessage } from "../services/api";

const lifeGallery = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
];

export default function RecruiterCompanyViewPage({ companySlug, onBack, onEdit }) {
  const [state, setState] = useState({ loading: true, error: "" });
  const [page, setPage] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!companySlug) {
      return;
    }

    let isCancelled = false;

    async function loadCompanyView() {
      setState({ loading: true, error: "" });

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
        setState({ loading: false, error: "" });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setState({ loading: false, error: getErrorMessage(error, "Failed to load recruiter company view.") });
      }
    }

    loadCompanyView();

    return () => {
      isCancelled = true;
    };
  }, [companySlug]);

  const draft = useMemo(() => page?.careerPage?.draft || { themeSettings: {}, banner: {}, sections: [] }, [page]);

  return (
    <AppShell>
      <main className="mx-auto min-h-screen max-w-[110rem] px-3 pb-14 pt-5 sm:px-5 lg:px-6 xl:px-8">
        <div className="mx-auto w-full max-w-[96rem]">
          <div className="mb-5 flex items-center justify-between">
            <button type="button" onClick={onBack} className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.10)]">Back</button>
            <div className="rounded-full bg-white/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.10)]">Recruiter View</div>
          </div>

          {state.error ? <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">{state.error}</div> : null}

          {state.loading ? (
            <div className="rounded-[34px] border border-slate-200/80 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">Loading company careers page...</div>
          ) : page ? (
            <CareersPageView
              companyName={page.company.name}
              themeSettings={draft.themeSettings}
              banner={draft.banner}
              sections={draft.sections}
              jobs={jobs}
              fallbackLifeImages={lifeGallery}
              showEdit
              onEdit={() => onEdit(companySlug)}
            />
          ) : null}
        </div>
      </main>
    </AppShell>
  );
}
