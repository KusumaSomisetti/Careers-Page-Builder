import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import PublicCareerPage from "./pages/PublicCareerPage";
import RecruiterAccessPage from "./pages/RecruiterAccessPage";
import RecruiterCompanyViewPage from "./pages/RecruiterCompanyViewPage";
import { createCompany, getErrorMessage, loginCompany } from "./services/api";

function editorPathFor(companySlug, section) {
  const sectionPath = {
    brand: "edit-brand",
    sections: "edit-sections",
    preview: "preview"
  };

  return `/${companySlug}/${sectionPath[section] || "edit-brand"}`;
}

function editorSectionFromPath(editorTab) {
  const sectionMap = {
    "edit-brand": "brand",
    "edit-sections": "sections",
    preview: "preview"
  };

  return sectionMap[editorTab] || "brand";
}

function RecruiterViewRoute() {
  const navigate = useNavigate();
  const { companySlug } = useParams();

  return <RecruiterCompanyViewPage companySlug={companySlug} onEdit={(slug) => navigate(editorPathFor(slug, "brand"))} />;
}

function DashboardRoute() {
  const navigate = useNavigate();
  const { companySlug, editorTab } = useParams();
  const initialSection = editorSectionFromPath(editorTab);

  return (
    <DashboardPage
      initialCompanySlug={companySlug}
      initialSection={initialSection}
      onSectionChange={(section) => navigate(editorPathFor(companySlug, section), { replace: true })}
      onExit={() => navigate(`/${companySlug}/recruiterview`)}
    />
  );
}

function PublicCareerRoute() {
  const navigate = useNavigate();
  const { companySlug } = useParams();

  return (
    <PublicCareerPage
      companySlug={companySlug}
      onBack={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          navigate(-1);
          return;
        }

        navigate("/");
      }}
    />
  );
}

function AppRoutes({
  accessMode,
  existingCompanyName,
  existingPassword,
  newCompanyName,
  newPassword,
  confirmPassword,
  accessState,
  onRecruiterLogin,
  onModeChange,
  onExistingCompanyNameChange,
  onExistingPasswordChange,
  onNewCompanyChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onContinueToCompanyView
}) {
  return (
    <Routes>
      <Route path="/" element={<LandingPage onRecruiterLogin={onRecruiterLogin} />} />
      <Route
        path="/login"
        element={
          <RecruiterAccessPage
            existingCompanyName={existingCompanyName}
            existingPassword={existingPassword}
            newCompanyName={newCompanyName}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            mode={accessMode}
            loading={accessState.loading}
            error={accessState.error}
            onModeChange={onModeChange}
            onExistingCompanyNameChange={onExistingCompanyNameChange}
            onExistingPasswordChange={onExistingPasswordChange}
            onNewCompanyChange={onNewCompanyChange}
            onNewPasswordChange={onNewPasswordChange}
            onConfirmPasswordChange={onConfirmPasswordChange}
            onContinue={onContinueToCompanyView}
          />
        }
      />
      <Route path="/:companySlug/recruiterview" element={<RecruiterViewRoute />} />
      <Route path="/:companySlug/:editorTab" element={<DashboardRoute />} />
      <Route path="/careers/:companySlug" element={<PublicCareerRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [accessMode, setAccessMode] = useState("existing");
  const [existingCompanyName, setExistingCompanyName] = useState("");
  const [existingPassword, setExistingPassword] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessState, setAccessState] = useState({
    loading: false,
    error: ""
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const openRecruiterAccess = () => {
    setAccessMode("existing");
    setExistingCompanyName("");
    setExistingPassword("");
    setNewCompanyName("");
    setNewPassword("");
    setConfirmPassword("");
    setAccessState({ loading: false, error: "" });
    navigate("/login");
  };

  const continueToCompanyView = async () => {
    setAccessState({ loading: true, error: "" });

    try {
      let company;

      if (accessMode === "existing") {
        company = await loginCompany({
          name: existingCompanyName.trim(),
          password: existingPassword
        });
      } else {
        if (newPassword.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }

        if (newPassword !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        company = await createCompany({
          name: newCompanyName.trim(),
          password: newPassword
        });
      }

      setAccessState({ loading: false, error: "" });
      navigate(`/${company.slug}/recruiterview`);
    } catch (error) {
      setAccessState({
        loading: false,
        error: getErrorMessage(error, error.message || "Failed to open recruiter workspace.")
      });
    }
  };

  const appRoutesProps = useMemo(
    () => ({
      accessMode,
      existingCompanyName,
      existingPassword,
      newCompanyName,
      newPassword,
      confirmPassword,
      accessState,
      onRecruiterLogin: openRecruiterAccess,
      onModeChange: setAccessMode,
      onExistingCompanyNameChange: setExistingCompanyName,
      onExistingPasswordChange: setExistingPassword,
      onNewCompanyChange: setNewCompanyName,
      onNewPasswordChange: setNewPassword,
      onConfirmPasswordChange: setConfirmPassword,
      onContinueToCompanyView: continueToCompanyView
    }),
    [accessMode, existingCompanyName, existingPassword, newCompanyName, newPassword, confirmPassword, accessState]
  );

  return <AppRoutes {...appRoutesProps} />;
}
