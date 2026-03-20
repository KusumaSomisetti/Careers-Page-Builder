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
      <main className="mx-auto min-h-screen max-w-7xl px-6 pb-16 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pb-20">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <BrandMark />
            <div className="leading-[0.9] tracking-tight text-slate-950">
              <p className="text-[1.85rem] font-semibold sm:text-[2.1rem]">HIREPOINT</p>
              <p className="text-[1.85rem] font-semibold sm:text-[2.1rem]">CAREERS</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-[18px] bg-[linear-gradient(180deg,rgba(241,245,249,0.95),rgba(226,232,240,0.95))] px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)] sm:px-5 sm:text-base"
          >
            <ArrowLeftIcon />
            <span>Back</span>
          </button>
        </header>

        <section className="mx-auto max-w-3xl pt-24 sm:pt-28 lg:max-w-4xl">
          <h1 className="max-w-[8ch] text-[4.25rem] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950 sm:text-[5.7rem] lg:text-[6.2rem]">
            Welcome Back, Recruiter.
          </h1>

          <div className="mt-10 flex flex-wrap gap-3">
            <ModeButton active={mode === "existing"} label="Existing company" onClick={() => onModeChange("existing")} />
            <ModeButton active={mode === "new"} label="New company" onClick={() => onModeChange("new")} />
          </div>

          <div className="mt-8 space-y-6">
            {mode === "existing" ? (
              <label className="block space-y-3">
                <span className="text-lg font-medium text-slate-500">Choose your company</span>
                <select
                  value={selectedCompanySlug}
                  onChange={(event) => onSelectCompany(event.target.value)}
                  className="w-full rounded-[26px] border-[3px] border-slate-300/80 bg-white px-8 py-7 text-[1.9rem] leading-tight text-slate-900 outline-none shadow-[0_12px_36px_rgba(15,23,42,0.06)] transition focus:border-slate-400"
                >
                  {companies.map((company) => (
                    <option key={company.slug} value={company.slug}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="block space-y-3">
                <span className="text-lg font-medium text-slate-500">Enter your company name</span>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(event) => onNewCompanyChange(event.target.value)}
                  placeholder="HirePoint Labs"
                  className="w-full rounded-[26px] border-[3px] border-slate-300/80 bg-white px-8 py-7 text-[1.9rem] leading-tight text-slate-900 outline-none shadow-[0_12px_36px_rgba(15,23,42,0.06)] transition placeholder:text-slate-400 focus:border-slate-400"
                />
              </label>
            )}

            <p className="text-right text-[1.05rem] text-slate-500">
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
            className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#0e8b92_0%,#0f6c72_100%)] px-8 py-5 text-[1.25rem] font-medium text-white shadow-[0_18px_44px_rgba(15,118,110,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(15,118,110,0.38)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Preparing workspace..." : "Continue Securely"}
          </button>

          <p className="mt-10 text-center text-[1.05rem] text-slate-600 sm:text-[1.15rem]">
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
