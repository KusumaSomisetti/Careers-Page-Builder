export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`.trim()} aria-hidden="true" />;
}

export function CareersPageSkeleton({ showBack = false, showEdit = false }) {
  return (
    <div className="w-full overflow-x-clip border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
      <div className="flex items-center justify-between gap-4 px-5 pb-5 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          {showBack ? <Skeleton className="h-11 w-11 rounded-2xl" /> : null}
          <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
        {showEdit ? <Skeleton className="h-11 w-28 rounded-full" /> : null}
      </div>

      <div className="border-y border-slate-200/80 px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="mt-5 h-14 w-3/4 rounded-2xl sm:h-16" />
        <Skeleton className="mt-4 h-4 w-full rounded-full" />
        <Skeleton className="mt-3 h-4 w-2/3 rounded-full" />
      </div>

      <div className="space-y-10 px-5 py-8 sm:px-6 sm:py-10 lg:space-y-14 lg:px-8 lg:py-12">
        <section>
          <Skeleton className="h-10 w-44 rounded-2xl" />
          <Skeleton className="mt-5 h-4 w-full rounded-full" />
          <Skeleton className="mt-3 h-4 w-11/12 rounded-full" />
          <Skeleton className="mt-3 h-4 w-4/5 rounded-full" />
        </section>

        <section>
          <Skeleton className="h-10 w-52 rounded-2xl" />
          <Skeleton className="mt-6 h-64 w-full rounded-[30px] sm:h-72" />
        </section>

        <section>
          <Skeleton className="h-10 w-48 rounded-2xl" />
          <div className="mt-6 flex gap-4 overflow-hidden">
            <Skeleton className="h-36 w-[15.5rem] shrink-0 rounded-[22px]" />
            <Skeleton className="hidden h-36 w-[15.5rem] shrink-0 rounded-[22px] sm:block" />
          </div>
          <div className="mt-6 rounded-[30px] border border-slate-200/80 bg-[linear-gradient(180deg,#fbfdfe_0%,#f4f8fb_100%)] p-4 sm:p-5 lg:p-6">
            <Skeleton className="h-5 w-40 rounded-full" />
            <Skeleton className="mt-4 h-4 w-3/4 rounded-full" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-14 w-full rounded-[20px]" />
              <Skeleton className="h-14 w-full rounded-[20px]" />
            </div>
            <Skeleton className="mt-5 h-40 w-full rounded-[24px]" />
          </div>
        </section>
      </div>
    </div>
  );
}

export function CardRowSkeleton({ count = 3 }) {
  return (
    <div className="hide-scrollbar mt-8 flex gap-5 overflow-x-auto pb-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-[260px] shrink-0 rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:w-[300px] lg:w-[340px]">
          <Skeleton className="h-32 w-full rounded-[18px] sm:h-36 lg:h-40" />
          <Skeleton className="mt-5 h-8 w-3/4 rounded-xl" />
          <Skeleton className="mt-3 h-4 w-1/2 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function JobGridSkeleton({ count = 6 }) {
  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="mt-4 h-8 w-4/5 rounded-xl" />
          <Skeleton className="mt-3 h-4 w-1/2 rounded-full" />
          <Skeleton className="mt-4 h-4 w-full rounded-full" />
          <Skeleton className="mt-3 h-4 w-5/6 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function DashboardBrandSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-[5.5rem] w-full rounded-[20px]" />
        <Skeleton className="h-[5.5rem] w-full rounded-[20px]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[4.75rem] w-full rounded-[20px]" />
        <Skeleton className="h-[4.75rem] w-full rounded-[20px]" />
        <Skeleton className="h-[4.75rem] w-full rounded-[20px]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-[5.5rem] w-full rounded-[20px]" />
        <Skeleton className="h-[5.5rem] w-full rounded-[20px]" />
        <Skeleton className="h-32 w-full rounded-[20px] sm:col-span-2" />
        <Skeleton className="h-[5.5rem] w-full rounded-[20px]" />
        <Skeleton className="h-[5.5rem] w-full rounded-[20px]" />
      </div>
    </div>
  );
}

function DashboardSectionsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 rounded-[20px] border border-slate-200 bg-white px-4 py-3.5">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-4 w-56 rounded-full" />
        </div>
        <Skeleton className="h-12 w-40 rounded-full" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-24 w-full rounded-[20px]" />
        <Skeleton className="h-24 w-full rounded-[20px]" />
        <Skeleton className="h-24 w-full rounded-[20px]" />
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-[5.5rem] w-full rounded-[18px] sm:col-span-2" />
          <Skeleton className="h-[5.5rem] w-full rounded-[18px]" />
        </div>
        <Skeleton className="mt-4 h-32 w-full rounded-[18px]" />
      </div>

      <div className="space-y-4 rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-8 w-44 rounded-xl" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-14 w-full rounded-[22px]" />
          <Skeleton className="h-14 w-full rounded-[22px]" />
        </div>
        <Skeleton className="h-28 w-full rounded-[24px]" />
      </div>
    </div>
  );
}

export function DashboardPanelSkeleton({ section = "brand" }) {
  return section === "sections" ? <DashboardSectionsSkeleton /> : <DashboardBrandSkeleton />;
}
