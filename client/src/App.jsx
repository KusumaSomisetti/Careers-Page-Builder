import { useEffect, useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import RecruiterAccessPage from "./pages/RecruiterAccessPage";
import RecruiterCompanyViewPage from "./pages/RecruiterCompanyViewPage";
import { createCompany, fetchCompanies, getErrorMessage } from "./services/api";

export default function App() {
  const [view, setView] = useState("landing");
  const [activeCompanySlug, setActiveCompanySlug] = useState("stripe");
  const [accessMode, setAccessMode] = useState("existing");
  const [accessCompanySlug, setAccessCompanySlug] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [accessCompanies, setAccessCompanies] = useState([]);
  const [accessState, setAccessState] = useState({
    loading: false,
    error: "",
    initialized: false
  });

  useEffect(() => {
    let isCancelled = false;

    async function loadAccessCompanies() {
      if (view !== "access") {
        return;
      }

      if (accessState.initialized && accessCompanies.length > 0) {
        return;
      }

      setAccessState({ loading: true, error: "", initialized: accessState.initialized });

      try {
        const companies = await fetchCompanies();

        if (isCancelled) {
          return;
        }

        setAccessCompanies(companies);
        setAccessCompanySlug((current) => current || companies[0]?.slug || "");
        setAccessState({ loading: false, error: "", initialized: true });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setAccessState({
          loading: false,
          error: getErrorMessage(error, "Failed to load companies."),
          initialized: true
        });
      }
    }

    loadAccessCompanies();

    return () => {
      isCancelled = true;
    };
  }, [view, accessState.initialized, accessCompanies.length]);

  const openRecruiterAccess = (companySlug = "") => {
    setAccessMode(companySlug ? "existing" : accessCompanies.length > 0 ? "existing" : "new");
    setAccessCompanySlug(companySlug || accessCompanySlug || accessCompanies[0]?.slug || "");
    setNewCompanyName("");
    setView("access");
  };

  const continueToCompanyView = async () => {
    setAccessState((current) => ({ ...current, loading: true, error: "" }));

    try {
      if (accessMode === "new") {
        const company = await createCompany({ name: newCompanyName.trim() });
        setAccessCompanies((current) => [...current, company].sort((left, right) => left.name.localeCompare(right.name)));
        setActiveCompanySlug(company.slug);
      } else {
        setActiveCompanySlug(accessCompanySlug);
      }

      setAccessState((current) => ({ ...current, loading: false, error: "", initialized: true }));
      setView("companyView");
    } catch (error) {
      setAccessState((current) => ({
        ...current,
        loading: false,
        error: getErrorMessage(error, "Failed to open recruiter workspace."),
        initialized: true
      }));
    }
  };

  if (view === "dashboard") {
    return (
      <DashboardPage
        initialCompanySlug={activeCompanySlug}
        onExit={() => setView("companyView")}
      />
    );
  }

  if (view === "companyView") {
    return (
      <RecruiterCompanyViewPage
        companySlug={activeCompanySlug}
        onBack={() => setView("landing")}
        onEdit={(companySlug) => {
          setActiveCompanySlug(companySlug);
          setView("dashboard");
        }}
      />
    );
  }

  if (view === "access") {
    return (
      <RecruiterAccessPage
        companies={accessCompanies}
        selectedCompanySlug={accessCompanySlug}
        newCompanyName={newCompanyName}
        mode={accessMode}
        loading={accessState.loading}
        error={accessState.error}
        onModeChange={setAccessMode}
        onSelectCompany={setAccessCompanySlug}
        onNewCompanyChange={setNewCompanyName}
        onContinue={continueToCompanyView}
        onBack={() => setView("landing")}
      />
    );
  }

  return <LandingPage onRecruiterLogin={openRecruiterAccess} />;
}
