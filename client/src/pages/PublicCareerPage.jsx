import { useEffect, useState } from "react";
import AppShell from "../components/dashboard/AppShell";
import CareersPageView from "../components/careers/CareersPageView";
import { CareersPageSkeleton } from "../components/Skeleton";
import { fetchPublicCareerPage, getErrorMessage } from "../services/api";

const lifeGallery = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
];

export default function PublicCareerPage({ companySlug }) {
  const [state, setState] = useState({ loading: true, error: "" });
  const [page, setPage] = useState(null);

  useEffect(() => {
    if (!companySlug) {
      return;
    }

    let isCancelled = false;

    async function loadPublicPage() {
      setState({ loading: true, error: "" });

      try {
        const careerPage = await fetchPublicCareerPage(companySlug);

        if (isCancelled) {
          return;
        }

        setPage(careerPage);
        setState({ loading: false, error: "" });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message = error.response?.status === 404
          ? "This careers page has not been published yet."
          : getErrorMessage(error, "Failed to load the public careers page.");

        setState({ loading: false, error: message });
      }
    }

    loadPublicPage();

    return () => {
      isCancelled = true;
    };
  }, [companySlug]);

  return (
    <AppShell>
      <main className="min-h-screen overflow-x-clip pb-0 pt-0">
        {state.error ? <div className="mx-3 mt-3 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 sm:mx-5 lg:mx-6 xl:mx-8">{state.error}</div> : null}

        {state.loading ? (
          <CareersPageSkeleton showBack={false} showEdit={false} />
        ) : page ? (
          <CareersPageView
            companyName={page.company.name}
            themeSettings={page.themeSettings}
            banner={page.banner}
            sections={page.sections}
            jobs={page.jobs}
            fallbackLifeImages={lifeGallery}
          />
        ) : null}
      </main>
    </AppShell>
  );
}
