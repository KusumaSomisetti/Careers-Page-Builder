import CareersPageView from "../careers/CareersPageView";

const previewLifeGallery = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
];

export default function CareersPreview({ page, jobsState }) {
  if (jobsState.loading) {
    return (
      <div className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        Loading jobs...
      </div>
    );
  }

  if (jobsState.error) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-700 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        {jobsState.error}
      </div>
    );
  }

  return (
    <CareersPageView
      companyName={page.company.name || "Your Company"}
      themeSettings={page.themeSettings}
      banner={page.banner}
      sections={page.sections}
      jobs={page.jobs}
      fallbackLifeImages={previewLifeGallery}
    />
  );
}
