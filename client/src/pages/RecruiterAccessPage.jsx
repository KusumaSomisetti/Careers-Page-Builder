import BrandMark from "../components/BrandMark";
import AppShell from "../components/dashboard/AppShell";

function ArrowLeftIcon() {
  return (
    <div className="relative h-4 w-4 text-slate-500">
      <div className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 rounded-full bg-current" />
      <div className="absolute left-0 top-[3px] h-[2px] w-2 rotate-[-45deg] rounded-full bg-current" />
      <div className="absolute left-0 bottom-[3px] h-[2px] w-2 rotate-[45deg] rounded-full bg-current" />
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ModeButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
      }`}
    >
      {label}
    </button>
  );
}

export default function RecruiterAccessPage({
  companies,
  selectedCompanySlug,
  newCompanyName,
  mode,
  loading,
  error,
  onModeChange,
  onSelectCompany,
  onNewCompanyChange,
  onContinue,
  onBack
}) {
  return (
    <AppShell>
      <main className="mx-auto min-h-screen max-w-[92rem] overflow-x-clip px-4 pb-14 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-16">
        <header className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap sm:items-center">
          <div className="flex items-center gap-4 sm:gap-5">
            <BrandMark />
            <div className="leading-[0.9] tracking-tight text-slate-950">
              <p className="text-[1.7rem] font-semibold sm:text-[2rem]">HIREPOINT</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(180deg,rgba(241,245,249,0.95),rgba(226,232,240,0.95))] px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)] sm:w-auto sm:px-5 sm:text-base"
          >
            <ArrowLeftIcon />
            <span>Back</span>
          </button>
        </header>

        <section className="mx-auto max-w-4xl pt-12 sm:pt-14 lg:pt-16">
          <h1 className="max-w-[10ch] text-[3.2rem] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950 sm:max-w-[12ch] sm:text-[4.4rem] lg:max-w-none lg:whitespace-nowrap lg:text-[4.8rem] xl:text-[5.4rem]">
            Welcome Back, Recruiter.
          </h1>

          <div className="mt-6 flex flex-wrap gap-3">
            <ModeButton active={mode === "existing"} label="Existing company" onClick={() => onModeChange("existing")} />
            <ModeButton active={mode === "new"} label="New company" onClick={() => onModeChange("new")} />
          </div>

          <div className="mt-6 space-y-5 rounded-[30px] border border-slate-200/80 bg-white/92 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-6 lg:p-7">
            {mode === "existing" ? (
              <label className="block space-y-3">
                <span className="text-base font-medium text-slate-500 sm:text-lg">Choose your company</span>
                <div className="relative">
                  <select
                    value={selectedCompanySlug}
                    onChange={(event) => onSelectCompany(event.target.value)}
                    className="w-full appearance-none rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-5 pr-14 text-[1.05rem] font-medium leading-tight text-slate-900 outline-none shadow-[0_12px_36px_rgba(15,23,42,0.06)] transition focus:border-slate-400 sm:px-6 sm:text-[1.15rem]"
                  >
                    {companies.map((company) => (
                      <option key={company.slug} value={company.slug}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
                <p className="text-sm leading-6 text-slate-500">
                  Open the recruiter workspace for an existing company with a cleaner, focused selection flow.
                </p>
              </label>
            ) : (
              <label className="block space-y-3">
                <span className="text-base font-medium text-slate-500 sm:text-lg">Enter your company name</span>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(event) => onNewCompanyChange(event.target.value)}
                  placeholder="HirePoint Labs"
                  className="w-full rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-5 text-[1.05rem] font-medium leading-tight text-slate-900 outline-none shadow-[0_12px_36px_rgba(15,23,42,0.06)] transition placeholder:text-slate-400 focus:border-slate-400 sm:px-6 sm:text-[1.15rem]"
                />
              </label>
            )}

            <p className="text-right text-[0.98rem] text-slate-500 sm:text-[1.02rem]">
              {mode === "existing" ? "Need a fresh workspace?" : "Already have a company in the system?"}
              <button
                type="button"
                onClick={() => onModeChange(mode === "existing" ? "new" : "existing")}
                className="ml-2 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900"
              >
                {mode === "existing" ? "Create new company" : "Choose existing company"}
              </button>
            </p>
          </div>

          {error ? (
            <div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onContinue}
            disabled={loading || (mode === "existing" ? !selectedCompanySlug : !newCompanyName.trim())}
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#0e8b92_0%,#0f6c72_100%)] px-8 py-4 text-[1.08rem] font-medium text-white shadow-[0_18px_44px_rgba(15,118,110,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(15,118,110,0.38)] disabled:cursor-not-allowed disabled:opacity-60 sm:text-[1.15rem]"
          >
            {loading ? "Preparing workspace..." : "Continue Securely"}
          </button>

          <p className="mt-8 text-center text-[1rem] text-slate-600 sm:text-[1.08rem]">
            Or,
            <button
              type="button"
              onClick={onBack}
              className="ml-2 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950"
            >
              Return to HirePoint home
            </button>
          </p>
        </section>
      </main>
    </AppShell>
  );
}
