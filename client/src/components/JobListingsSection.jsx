import { useState } from "react";
import { jobListings } from "../data/careers";
import JobCard from "./JobCard";
import JobFilters from "./JobFilters";
import SectionHeading from "./SectionHeading";

const ALL_LOCATIONS = "All locations";
const ALL_TYPES = "All types";

const locations = [...new Set(jobListings.map((job) => job.location))];
const types = [...new Set(jobListings.map((job) => job.type))];

export default function JobListingsSection() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(ALL_LOCATIONS);
  const [selectedType, setSelectedType] = useState(ALL_TYPES);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const query = searchValue.trim().toLowerCase();
  const filteredJobs = jobListings.filter((job) => {
    const matchesTitle = query.length === 0 || job.title.toLowerCase().includes(query);
    const matchesLocation =
      selectedLocation === ALL_LOCATIONS || job.location === selectedLocation;
    const matchesType = selectedType === ALL_TYPES || job.type === selectedType;

    return matchesTitle && matchesLocation && matchesType;
  });

  const resetFilters = () => {
    setSearchValue("");
    setSelectedLocation(ALL_LOCATIONS);
    setSelectedType(ALL_TYPES);
  };

  return (
    <section id="open-roles" className="py-10 sm:py-14">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Open Roles"
          title="Open roles for builders who care deeply about clarity and craft."
          description="We’re hiring across design, engineering, and customer-facing teams. Every role is structured for focus, autonomy, and meaningful impact."
        />

        <JobFilters
          isOpen={isMobileFiltersOpen}
          locations={locations}
          types={types}
          searchValue={searchValue}
          selectedLocation={selectedLocation}
          selectedType={selectedType}
          onSearchChange={setSearchValue}
          onLocationChange={setSelectedLocation}
          onTypeChange={setSelectedType}
          onToggle={() => setIsMobileFiltersOpen((current) => !current)}
          onReset={resetFilters}
        />

        {filteredJobs.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={`${job.title}-${job.location}`} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <p className="text-lg font-semibold text-slate-950">No matching roles found</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Try a different title, location, or job type to explore more openings.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
