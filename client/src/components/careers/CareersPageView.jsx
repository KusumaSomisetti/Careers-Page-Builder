import { useEffect, useMemo, useState } from "react";
import BrandMark from "../BrandMark";

function BackButton({ onClick, isDark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 min-w-11 items-center justify-center rounded-2xl px-4 text-sm font-medium shadow-[0_10px_24px_rgba(15,23,42,0.10)] transition ${
        isDark ? "bg-slate-900/92 text-slate-100 hover:bg-slate-900" : "bg-white/92 text-slate-700 hover:bg-white"
      }`}
    >
      <span aria-hidden="true" className="text-lg">&larr;</span>
    </button>
  );
}

function EditIcon() {
  return (
    <div className="relative h-4.5 w-4.5">
      <div className="absolute left-0 top-3 h-0.5 w-3.5 rounded-full bg-current" />
      <div className="absolute right-0 top-0 h-3 w-3 rotate-45 rounded-sm border-2 border-current border-l-0 border-b-0" />
    </div>
  );
}

function ChevronIcon({ direction = "right" }) {
  const rotation = direction === "left" ? "rotate-180" : "";

  return (
    <svg viewBox="0 0 20 20" fill="none" className={`h-4 w-4 ${rotation}`} aria-hidden="true">
      <path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="2" />
      <path d="m13 13 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LogoBadge({ companyName, logoText, logoImageUrl, accentColor, isDark }) {
  return (
    <div className={`flex h-12 min-w-12 items-center justify-center overflow-hidden rounded-2xl px-3 shadow-[0_10px_24px_rgba(15,23,42,0.10)] ${isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-700"}`}>
      {logoImageUrl ? (
        <img src={logoImageUrl} alt={companyName} className="h-9 w-9 rounded-xl object-cover" />
      ) : logoText ? (
        <span className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: accentColor }}>
          {logoText}
        </span>
      ) : (
        <div aria-label={companyName} className="scale-[0.82]">
          <BrandMark />
        </div>
      )}
    </div>
  );
}

function ActionButton({ onClick, isDark }) {
  return (
    <button
      type="button"
      aria-label="Want to edit?"
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 ${
        isDark ? "bg-white text-slate-950 hover:bg-slate-100" : "bg-slate-950 text-white hover:bg-slate-800"
      }`}
    >
      <span>Want to edit?</span>
    </button>
  );
}

function SectionHeading({ title, meta, delay = 0, isDark }) {
  return (
    <div className="careers-reveal space-y-2" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between gap-4">
        <h2 className={`text-[2rem] font-semibold tracking-tight sm:text-[2.3rem] ${isDark ? "text-slate-100" : "text-slate-950"}`}>{title}</h2>
        {meta ? (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"}`}>
            {meta}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function LifeCarousel({ images, isDark }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = images.length;

  useEffect(() => {
    if (activeIndex > total - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, total]);

  useEffect(() => {
    if (total <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [total]);

  if (images.length === 0) {
    return (
      <div className={`careers-reveal rounded-[24px] border px-5 py-6 text-sm ${isDark ? "border-slate-800 bg-slate-900 text-slate-300" : "border-slate-200/80 bg-slate-50 text-slate-500"}`} style={{ animationDelay: "120ms" }}>
        Life at company media will appear here.
      </div>
    );
  }

  const getOffset = (index) => {
    let offset = index - activeIndex;
    if (offset > 1) offset -= total;
    if (offset < -1) offset += total;
    return Math.max(-1, Math.min(1, offset));
  };

  return (
    <div className="careers-reveal" style={{ animationDelay: "120ms" }}>
      <div className={`relative h-[16rem] overflow-hidden rounded-[30px] ${isDark ? "bg-[linear-gradient(180deg,#0f172a_0%,#1e293b_100%)]" : "bg-[linear-gradient(180deg,#eff4f8_0%,#dbe5ee_100%)]"} sm:h-[19rem] lg:h-[23rem]`}>
        <div className="absolute inset-0 perspective-[1600px]">
          {images.map((imageUrl, index) => {
            const offset = getOffset(index);
            const isActive = index === activeIndex;
            const translateX = offset * 54;
            const rotateY = offset * -35;
            const scale = isActive ? 1 : 0.84;
            const opacity = isActive ? 1 : 0.42;
            const zIndex = isActive ? 3 : offset === 0 ? 2 : 1;

            return (
              <div
                key={`${imageUrl}-${index}`}
                className="absolute left-1/2 top-1/2 h-[72%] w-[76%] overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition duration-500 ease-out sm:h-[78%] sm:w-[72%] lg:w-[68%]"
                style={{
                  transform: `translate3d(calc(-50% + ${translateX}%), -50%, 0) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex
                }}
              >
                <img src={imageUrl} alt={`Life at company ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            );
          })}
        </div>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current - 1 + total) % total)}
              className={`absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_12px_30px_rgba(15,23,42,0.15)] transition ${isDark ? "bg-slate-900/90 text-slate-100 hover:bg-slate-900" : "bg-white/90 text-slate-700 hover:bg-white"}`}
              aria-label="Previous image"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current + 1) % total)}
              className={`absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_12px_30px_rgba(15,23,42,0.15)] transition ${isDark ? "bg-slate-900/90 text-slate-100 hover:bg-slate-900" : "bg-white/90 text-slate-700 hover:bg-white"}`}
              aria-label="Next image"
            >
              <ChevronIcon />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition ${index === activeIndex ? "w-7 bg-slate-950" : isDark ? "w-2.5 bg-slate-700 hover:bg-slate-600" : "w-2.5 bg-slate-300 hover:bg-slate-400"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RoleGroupScroller({ groups, selectedTitle, onSelect, isDark }) {
  return (
    <div className="hide-scrollbar careers-reveal flex snap-x gap-4 overflow-x-auto pb-2" style={{ animationDelay: "160ms" }}>
      {groups.map((group) => {
        const active = group.title === selectedTitle;
        return (
          <button
            key={group.title}
            type="button"
            onClick={() => onSelect(group.title)}
            className={`w-[15.5rem] shrink-0 snap-start rounded-[22px] border p-4 shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition sm:w-[17rem] ${
              active
                ? "border-slate-950 bg-slate-950 text-white"
                : isDark
                  ? "border-slate-800 bg-slate-900 text-slate-100 hover:border-slate-700"
                  : "border-slate-200/80 bg-white text-slate-950 hover:border-slate-300"
            }`}
          >
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${active ? "text-slate-300" : isDark ? "text-slate-500" : "text-slate-400"}`}>
              Role Family
            </p>
            <h3 className="mt-3 text-[1.15rem] font-semibold leading-6 tracking-tight sm:text-[1.25rem]">{group.title}</h3>
            <p className={`mt-4 text-sm font-medium ${active ? "text-slate-200" : isDark ? "text-slate-300" : "text-slate-600"}`}>
              {group.count} {group.count === 1 ? "opening" : "openings"}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function RoleFilters({ search, onSearchChange, location, onLocationChange, type, onTypeChange, locations, types, accentColor, isDark }) {
  const inputClasses = isDark
    ? "border-slate-700/80 bg-slate-900 text-slate-100 placeholder:text-slate-500"
    : "border-slate-300/80 bg-white text-slate-700 placeholder:text-slate-400";
  const selectClasses = isDark
    ? "border-slate-700/80 bg-[linear-gradient(180deg,#0f172a_0%,#162033_100%)] text-slate-100"
    : "border-slate-300/80 bg-[linear-gradient(180deg,#f8fbfd_0%,#edf3f7_100%)] text-slate-900";

  return (
    <div className="careers-reveal grid gap-3" style={{ animationDelay: "180ms" }}>
      <label className="block">
        <span className="sr-only">Search by job title</span>
        <div className={`flex items-center gap-3 rounded-[20px] border px-3.5 py-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:px-4 sm:py-4 ${inputClasses}`}>
          <div style={{ color: accentColor }}>
            <SearchIcon />
          </div>
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by Job Title..."
            className="min-w-0 flex-1 bg-transparent text-[0.98rem] outline-none sm:text-[1.05rem]"
          />
        </div>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Location</span>
          <div className="relative">
            <select
              value={location}
              onChange={(event) => onLocationChange(event.target.value)}
              className={`w-full appearance-none rounded-[20px] border px-4 py-3.5 pr-10 text-[0.98rem] outline-none sm:rounded-full sm:px-5 sm:py-4 sm:pr-12 sm:text-[1.05rem] ${selectClasses}`}
            >
              <option value="">Location</option>
              {locations.map((entry) => (
                <option key={entry} value={entry}>{entry}</option>
              ))}
            </select>
            <div className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 sm:right-5 ${isDark ? "text-slate-300" : "text-slate-500"}`}><ChevronIcon /></div>
          </div>
        </label>

        <label className="block">
          <span className="sr-only">Job type</span>
          <div className="relative">
            <select
              value={type}
              onChange={(event) => onTypeChange(event.target.value)}
              className={`w-full appearance-none rounded-[20px] border px-4 py-3.5 pr-10 text-[0.98rem] outline-none sm:rounded-full sm:px-5 sm:py-4 sm:pr-12 sm:text-[1.05rem] ${selectClasses}`}
            >
              <option value="">Job Type</option>
              {types.map((entry) => (
                <option key={entry} value={entry}>{entry}</option>
              ))}
            </select>
            <div className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 sm:right-5 ${isDark ? "text-slate-300" : "text-slate-500"}`}><ChevronIcon /></div>
          </div>
        </label>
      </div>
    </div>
  );
}

function JobDetailCard({ job, accentColor, isDark }) {
  return (
    <article className={`rounded-[24px] border p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)] sm:p-6 ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-200/80 bg-white"}`}>
      <h3 className={`text-[1.28rem] font-semibold leading-[1.2] tracking-tight sm:text-[1.4rem] ${isDark ? "text-slate-100" : "text-slate-950"}`}>
        {job.title} - {job.type || "Full Time"} - {job.location || "Remote"}
      </h3>
      <p className={`mt-3 text-sm leading-7 sm:text-[0.95rem] ${isDark ? "text-slate-300" : "text-slate-600"}`}>
        {job.summary || "Description and responsibilities for this role will be added shortly."}
      </p>
      <button
        type="button"
        className="mt-5 inline-flex min-w-[180px] items-center justify-center rounded-full px-5 py-3 text-base font-medium text-white shadow-[0_16px_34px_rgba(13,148,136,0.24)] sm:min-w-[220px] sm:px-6 sm:py-3.5 sm:text-lg"
        style={{ background: `linear-gradient(90deg, ${accentColor}, #2f9da5)` }}
      >
        Apply Now
      </button>
    </article>
  );
}

function OpenRolesSection({ section, jobs, companyName, accentColor, isDark }) {
  const roleGroups = useMemo(() => {
    const grouped = new Map();
    jobs.forEach((job) => {
      const key = job.title || "Open Role";
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(job);
    });
    return Array.from(grouped.entries()).map(([title, groupedJobs]) => ({ title, jobs: groupedJobs, count: groupedJobs.length }));
  }, [jobs]);

  const [selectedRoleTitle, setSelectedRoleTitle] = useState(roleGroups[0]?.title || "");
  const [searchValue, setSearchValue] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    if (!roleGroups.length) {
      setSelectedRoleTitle("");
      return;
    }
    if (!roleGroups.some((group) => group.title === selectedRoleTitle)) {
      setSelectedRoleTitle(roleGroups[0].title);
    }
  }, [roleGroups, selectedRoleTitle]);

  useEffect(() => {
    setSearchValue("");
    setLocationFilter("");
    setTypeFilter("");
  }, [selectedRoleTitle]);

  const selectedGroup = roleGroups.find((group) => group.title === selectedRoleTitle) || null;
  const selectedJobs = selectedGroup?.jobs || [];
  const availableLocations = [...new Set(selectedJobs.map((job) => job.location).filter(Boolean))];
  const availableTypes = [...new Set(selectedJobs.map((job) => job.type).filter(Boolean))];

  const filteredSelectedJobs = selectedJobs.filter((job) => {
    const normalizedQuery = searchValue.trim().toLowerCase();
    const matchesSearch = !normalizedQuery || job.title.toLowerCase().includes(normalizedQuery);
    const matchesLocation = !locationFilter || job.location === locationFilter;
    const matchesType = !typeFilter || job.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  const openRolesLabel = `${jobs.length} ${jobs.length === 1 ? "role" : "roles"} available`;

  return (
    <section>
      <SectionHeading title={section.title} meta={openRolesLabel} delay={160} isDark={isDark} />
      {section.content?.headline ? <p className={`careers-reveal mt-3 text-sm leading-7 ${isDark ? "text-slate-400" : "text-slate-500"}`} style={{ animationDelay: "170ms" }}>{section.content.headline}</p> : null}
      <div className="mt-4 space-y-6 lg:mt-6 lg:space-y-8">
        {roleGroups.length > 0 ? (
          <>
            <RoleGroupScroller groups={roleGroups} selectedTitle={selectedRoleTitle} onSelect={setSelectedRoleTitle} isDark={isDark} />
            {selectedGroup ? (
              <div className={`rounded-[30px] border p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] sm:p-5 lg:p-6 ${isDark ? "border-slate-800 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)]" : "border-slate-200/80 bg-[linear-gradient(180deg,#fbfdfe_0%,#f4f8fb_100%)]"}`}>
                <div className="careers-reveal mb-5 flex flex-wrap items-end justify-between gap-4" style={{ animationDelay: "170ms" }}>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Selected Role</p>
                    <h3 className={`mt-2 text-[1.6rem] font-semibold tracking-tight sm:text-[1.9rem] ${isDark ? "text-slate-100" : "text-slate-950"}`}>{selectedGroup.title}</h3>
                    <p className={`mt-2 text-sm leading-7 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{selectedGroup.count} {selectedGroup.count === 1 ? "opening" : "openings"} for this role at {companyName}.</p>
                  </div>
                </div>
                <RoleFilters search={searchValue} onSearchChange={setSearchValue} location={locationFilter} onLocationChange={setLocationFilter} type={typeFilter} onTypeChange={setTypeFilter} locations={availableLocations} types={availableTypes} accentColor={accentColor} isDark={isDark} />
                <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-1">
                  {filteredSelectedJobs.length > 0 ? filteredSelectedJobs.map((job) => (
                    <div key={job.id} className="careers-reveal" style={{ animationDelay: "220ms" }}><JobDetailCard job={job} accentColor={accentColor} isDark={isDark} /></div>
                  )) : <div className={`careers-reveal rounded-[24px] border px-5 py-6 text-sm ${isDark ? "border-slate-800 bg-slate-900 text-slate-300" : "border-slate-200/80 bg-white text-slate-500"}`} style={{ animationDelay: "220ms" }}>No openings match the current filters.</div>}
                </div>
              </div>
            ) : null}
          </>
        ) : <div className={`careers-reveal rounded-[24px] border px-5 py-6 text-sm ${isDark ? "border-slate-800 bg-slate-900 text-slate-300" : "border-slate-200/80 bg-slate-50 text-slate-500"}`} style={{ animationDelay: "180ms" }}>No open roles available right now.</div>}
      </div>
    </section>
  );
}

export default function CareersPageView({
  companyName,
  themeSettings,
  banner,
  sections,
  jobs,
  showEdit = false,
  onEdit,
  fallbackLifeImages = [],
  onBack
}) {
  const isDark = themeSettings?.mode === "dark";
  const accentColor = themeSettings?.accentColor || "#0f766e";
  const primaryColor = themeSettings?.primaryColor || "#0f172a";
  const bannerImage = themeSettings?.bannerImageUrl || banner?.imageUrl || fallbackLifeImages[0] || "";
  const visibleSections = (sections || []).filter((section) => section.isVisible);

  return (
    <div className={`w-full max-w-full overflow-x-clip border shadow-[0_24px_80px_rgba(15,23,42,0.10)] ${isDark ? "border-slate-800 bg-slate-950" : "border-slate-200/80 bg-white"}`}>
      <div className="flex items-center justify-between gap-4 px-5 pb-5 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          {onBack ? <BackButton onClick={onBack} isDark={isDark} /> : null}
          <LogoBadge companyName={companyName} logoText={themeSettings?.logoText} logoImageUrl={themeSettings?.logoImageUrl} accentColor={accentColor} isDark={isDark} />
        </div>
        {showEdit ? <ActionButton onClick={onEdit} isDark={isDark} /> : null}
      </div>

      <section
        className="careers-reveal relative overflow-hidden border-y border-slate-200/80 px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14"
        style={{
          animationDelay: "40ms",
          backgroundImage: `linear-gradient(135deg, ${primaryColor}cc, ${accentColor}99), url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_32%)]" />
        <div className="relative z-10 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Careers</p>
          <h1 className="mt-3 text-[2.5rem] font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-[3.2rem] lg:text-[4.5rem]">{banner?.headline || companyName}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82 sm:text-base lg:text-lg lg:leading-8">{banner?.subheadline || `Explore opportunities at ${companyName}.`}</p>
        </div>
      </section>

      <div className={`min-w-0 space-y-10 px-5 py-8 sm:px-6 sm:py-10 lg:space-y-14 lg:px-8 lg:py-12 ${isDark ? "bg-slate-950" : "bg-white"}`}>
        {visibleSections.map((section, index) => {
          if (section.type === "about_us") {
            return (
              <section key={section.id}>
                <SectionHeading title={section.title} delay={80 + index * 20} isDark={isDark} />
                <p className={`careers-reveal mt-4 max-w-5xl text-[1.02rem] leading-8 sm:text-[1.08rem] lg:text-[1.12rem] lg:leading-9 ${isDark ? "text-slate-300" : "text-slate-600"}`} style={{ animationDelay: `${100 + index * 20}ms` }}>
                  {section.content?.body || "Tell candidates what makes your company worth joining."}
                </p>
              </section>
            );
          }

          if (section.type === "life_at_company") {
            const lifeImages = Array.isArray(section.content?.items) && section.content.items.length > 0 ? section.content.items : fallbackLifeImages;
            return (
              <section key={section.id}>
                <SectionHeading title={section.title} delay={120 + index * 20} isDark={isDark} />
                {section.content?.headline ? <p className={`careers-reveal mt-3 text-sm leading-7 ${isDark ? "text-slate-400" : "text-slate-500"}`} style={{ animationDelay: `${130 + index * 20}ms` }}>{section.content.headline}</p> : null}
                <div className="mt-4 lg:mt-6"><LifeCarousel images={lifeImages} isDark={isDark} /></div>
              </section>
            );
          }

          if (section.type === "open_roles") {
            return <OpenRolesSection key={section.id} section={section} jobs={jobs} companyName={companyName} accentColor={accentColor} isDark={isDark} />;
          }

          return (
            <section key={section.id}>
              <SectionHeading title={section.title} delay={140 + index * 20} isDark={isDark} />
              <p className={`careers-reveal mt-4 max-w-5xl text-[1.02rem] leading-8 sm:text-[1.08rem] lg:text-[1.12rem] lg:leading-9 ${isDark ? "text-slate-300" : "text-slate-600"}`} style={{ animationDelay: `${160 + index * 20}ms` }}>
                {section.content?.body || "Add custom content for this section."}
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
