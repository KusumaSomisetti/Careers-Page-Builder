import { useEffect, useMemo, useState } from "react";

const SECTION_LIBRARY = [
  { type: "about_us", label: "About Us", template: { body: "Tell candidates what makes your company worth joining." } },
  { type: "life_at_company", label: "Life at Company", template: { headline: "Show how your team works and grows together.", items: [] } },
  { type: "open_roles", label: "Open Roles", template: { headline: "Explore current opportunities" } }
];

function createSection(type) {
  const definition = SECTION_LIBRARY.find((entry) => entry.type === type);
  const baseId = definition?.label?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || type;
  return {
    id: `${baseId}-${Date.now()}`,
    type,
    title: definition?.label || "Section",
    isVisible: true,
    content: structuredClone(definition?.template || {})
  };
}

function SectionRow({ section, isActive, onClick, onMove, onRemove }) {
  return (
    <div className={`rounded-[20px] border p-4 transition ${isActive ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={onClick} className="min-w-0 flex-1 text-left">
          <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${isActive ? "text-slate-300" : "text-slate-400"}`}>{section.type.replace(/_/g, " ")}</p>
          <p className="mt-2 truncate text-base font-semibold tracking-tight">{section.title}</p>
        </button>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => onMove(-1)} className={`rounded-full px-3 py-1 text-xs font-semibold ${isActive ? "bg-white/12 text-white" : "bg-slate-100 text-slate-600"}`}>Up</button>
          <button type="button" onClick={() => onMove(1)} className={`rounded-full px-3 py-1 text-xs font-semibold ${isActive ? "bg-white/12 text-white" : "bg-slate-100 text-slate-600"}`}>Down</button>
          <button type="button" onClick={onRemove} className={`rounded-full px-3 py-1 text-xs font-semibold ${isActive ? "bg-rose-500/20 text-rose-100" : "bg-rose-50 text-rose-600"}`}>Remove</button>
        </div>
      </div>
    </div>
  );
}

export default function SectionsEditor({ sections, onChange }) {
  const [selectedSectionId, setSelectedSectionId] = useState(sections[0]?.id || "");

  useEffect(() => {
    if (!sections.length) {
      setSelectedSectionId("");
      return;
    }

    if (!sections.some((section) => section.id === selectedSectionId)) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId]);

  const selectedSection = useMemo(() => {
    return sections.find((section) => section.id === selectedSectionId) || null;
  }, [sections, selectedSectionId]);

  const updateSection = (sectionId, updates) => {
    onChange(sections.map((section) => (section.id === sectionId ? { ...section, ...updates } : section)));
  };

  const updateContent = (sectionId, contentUpdates) => {
    onChange(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, content: { ...section.content, ...contentUpdates } }
          : section
      )
    );
  };

  const moveSection = (sectionId, direction) => {
    const index = sections.findIndex((section) => section.id === sectionId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= sections.length) {
      return;
    }

    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const removeSection = (sectionId) => {
    onChange(sections.filter((section) => section.id !== sectionId));
  };

  const addSection = (type) => {
    const next = [...sections, createSection(type)];
    onChange(next);
    setSelectedSectionId(next[next.length - 1].id);
  };

  const lifeItemsText = Array.isArray(selectedSection?.content?.items) ? selectedSection.content.items.join("\n") : "";

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {sections.map((section) => (
          <SectionRow
            key={section.id}
            section={section}
            isActive={section.id === selectedSectionId}
            onClick={() => setSelectedSectionId(section.id)}
            onMove={(direction) => moveSection(section.id, direction)}
            onRemove={() => removeSection(section.id)}
          />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {SECTION_LIBRARY.map((entry) => (
          <button
            key={entry.type}
            type="button"
            onClick={() => addSection(entry.type)}
            className="rounded-[18px] border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
          >
            Add {entry.label}
          </button>
        ))}
      </div>

      {selectedSection ? (
        <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Section title</span>
              <input
                type="text"
                value={selectedSection.title}
                onChange={(event) => updateSection(selectedSection.id, { title: event.target.value })}
                className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Visibility</span>
              <select
                value={selectedSection.isVisible ? "visible" : "hidden"}
                onChange={(event) => updateSection(selectedSection.id, { isVisible: event.target.value === "visible" })}
                className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
              >
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
              </select>
            </label>
          </div>

          {selectedSection.type === "about_us" ? (
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-medium text-slate-700">About content</span>
              <textarea
                rows={7}
                value={selectedSection.content?.body || ""}
                onChange={(event) => updateContent(selectedSection.id, { body: event.target.value })}
                className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none"
              />
            </label>
          ) : null}

          {selectedSection.type === "life_at_company" ? (
            <div className="mt-4 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Section headline</span>
                <input
                  type="text"
                  value={selectedSection.content?.headline || ""}
                  onChange={(event) => updateContent(selectedSection.id, { headline: event.target.value })}
                  className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Gallery image URLs</span>
                <textarea
                  rows={6}
                  value={lifeItemsText}
                  onChange={(event) => updateContent(selectedSection.id, {
                    items: event.target.value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
                  })}
                  placeholder="One image URL per line"
                  className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none"
                />
              </label>
            </div>
          ) : null}

          {selectedSection.type === "open_roles" ? (
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-medium text-slate-700">Section headline</span>
              <input
                type="text"
                value={selectedSection.content?.headline || ""}
                onChange={(event) => updateContent(selectedSection.id, { headline: event.target.value })}
                className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
          ) : null}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-5 text-sm text-slate-500">
          Add a section to start structuring the page.
        </div>
      )}
    </div>
  );
}
