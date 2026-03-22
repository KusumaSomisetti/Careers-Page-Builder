import BrandMark from "../components/BrandMark";
import AppShell from "../components/dashboard/AppShell";

function ModeButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-[0.82rem] font-medium transition sm:px-4 sm:py-2 sm:text-sm ${
        active
          ? "bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
      }`}
    >
      {label}
    </button>
  );
}

function Field({ label, type = "text", value, onChange, placeholder, autoComplete }) {
  return (
    <label className="block space-y-2.5">
      <span className="text-sm font-medium text-slate-500 sm:text-base">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-3.5 text-[0.98rem] font-medium leading-tight text-slate-900 outline-none shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition placeholder:text-slate-400 focus:border-slate-400 sm:rounded-[24px] sm:px-5 sm:py-4 sm:text-[1.05rem]"
      />
    </label>
  );
}

export default function RecruiterAccessPage({
  existingCompanyName,
  existingPassword,
  newCompanyName,
  newPassword,
  confirmPassword,
  mode,
  loading,
  error,
  onModeChange,
  onExistingCompanyNameChange,
  onExistingPasswordChange,
  onNewCompanyChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onContinue
}) {
  const isExistingDisabled = !existingCompanyName.trim() || !existingPassword;
  const isNewDisabled = !newCompanyName.trim() || !newPassword || !confirmPassword;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (mode === "existing" ? isExistingDisabled : isNewDisabled) {
      return;
    }

    onContinue();
  };

  return (
    <AppShell>
      <main className="mx-auto min-h-screen max-w-[92rem] overflow-x-clip px-4 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8 lg:pb-16">
        <header className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap sm:items-center">
          <div className="flex items-center gap-4 sm:gap-5">
            <BrandMark />
            <div className="leading-[0.9] tracking-tight text-slate-950">
              <p className="text-[1.7rem] font-semibold sm:text-[2rem]">HIREPOINT</p>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-4xl pt-8 sm:pt-12 lg:pt-16">
          <h1 className="max-w-[10ch] text-[3.2rem] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950 sm:max-w-[12ch] sm:text-[4.4rem] lg:max-w-none lg:whitespace-nowrap lg:text-[4.8rem] xl:text-[5.4rem]">
            Welcome Back, Recruiter.
          </h1>

          <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
            <ModeButton active={mode === "existing"} label="Existing company" onClick={() => onModeChange("existing")} />
            <ModeButton active={mode === "new"} label="New company" onClick={() => onModeChange("new")} />
          </div>

          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6">
            <div className="space-y-4 rounded-[24px] border border-slate-200/80 bg-white/92 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:space-y-5 sm:rounded-[30px] sm:p-6 lg:p-7">
              {mode === "existing" ? (
                <div className="space-y-4 sm:space-y-5">
                  <Field
                    label="Company name"
                    value={existingCompanyName}
                    onChange={onExistingCompanyNameChange}
                    placeholder="Acme Labs"
                    autoComplete="organization"
                  />
                  <Field
                    label="Password"
                    type="password"
                    value={existingPassword}
                    onChange={onExistingPasswordChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <p className="text-[0.84rem] leading-5 text-slate-500 sm:text-sm sm:leading-6">
                    Sign in with your company name and recruiter password to open the workspace.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5">
                  <Field
                    label="Company name"
                    value={newCompanyName}
                    onChange={onNewCompanyChange}
                    placeholder="HirePoint Labs"
                    autoComplete="organization"
                  />
                  <Field
                    label="Password"
                    type="password"
                    value={newPassword}
                    onChange={onNewPasswordChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />
                  <Field
                    label="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={onConfirmPasswordChange}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                  />
                  <p className="text-[0.84rem] leading-5 text-slate-500 sm:text-sm sm:leading-6">
                    Create a company workspace with a password you can reuse when you come back.
                  </p>
                </div>
              )}

              <p className="text-right text-[0.9rem] text-slate-500 sm:text-[1.02rem]">
                {mode === "existing" ? "Need a fresh workspace?" : "Already have a company in the system?"}
                <button
                  type="button"
                  onClick={() => onModeChange(mode === "existing" ? "new" : "existing")}
                  className="ml-2 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900"
                >
                  {mode === "existing" ? "Create new company" : "Sign in instead"}
                </button>
              </p>
            </div>

            {error ? (
              <div className="mt-4 rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:mt-6 sm:rounded-[24px] sm:px-5 sm:py-4">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || (mode === "existing" ? isExistingDisabled : isNewDisabled)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#0e8b92_0%,#0f6c72_100%)] px-8 py-3.5 text-[1rem] font-medium text-white shadow-[0_18px_44px_rgba(15,118,110,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(15,118,110,0.38)] disabled:cursor-not-allowed disabled:opacity-60 sm:mt-8 sm:py-4 sm:text-[1.15rem]"
            >
              {loading ? "Preparing workspace..." : mode === "existing" ? "Sign In Securely" : "Create Company Workspace"}
            </button>
          </form>
        </section>
      </main>
    </AppShell>
  );
}
