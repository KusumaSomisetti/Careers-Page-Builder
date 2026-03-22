import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/dashboard/AppShell";
import CareersPageView from "../components/careers/CareersPageView";
import { CareersPageSkeleton } from "../components/Skeleton";
import { fetchCareerPageEditor, fetchJobs, getErrorMessage } from "../services/api";

const lifeGallery = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
];

export default function RecruiterCompanyViewPage({ companySlug, onEdit }) {
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
      <main className="min-h-screen overflow-x-clip pb-0 pt-0">
        {state.error ? <div className="mx-3 mt-3 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 sm:mx-5 lg:mx-6 xl:mx-8">{state.error}</div> : null}

        {state.loading ? (
          <CareersPageSkeleton showEdit />
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
      </main>
    </AppShell>
  );
}
