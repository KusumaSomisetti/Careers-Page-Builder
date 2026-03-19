import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import JobListingsSection from "./components/JobListingsSection";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-50">
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
          Careers Page Builder
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          React, Vite, Express, and Tailwind are ready.
        </h1>
        <p className="text-base text-slate-300 sm:text-lg">
          Start building from a clean full-stack foundation.
        </p>
      </div>
    </main>
  );
}