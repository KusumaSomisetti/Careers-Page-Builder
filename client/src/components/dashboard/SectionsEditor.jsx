import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

function createCustomSection() {
  return {
    id: `custom-section-${Date.now()}`,
    type: "custom",
    title: "New Section",
    isVisible: true,
    content: {
      body: "Add section content here."
    }
  };
}

function SectionRow({ section, isActive, onClick, onMove, onRemove }) {
  const sectionLabel = section.type === "custom" ? "custom section" : section.type.replace(/_/g, " ");

  return (
    <div className={`rounded-[20px] border p-4 transition ${isActive ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={onClick} className="min-w-0 flex-1 text-left">
          <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${isActive ? "text-slate-300" : "text-slate-400"}`}>{sectionLabel}</p>
          <p className="mt-2 truncate text-base font-semibold tracking-tight">{section.title}</p>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onMove(-1)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${isActive ? "bg-white/12 text-white" : "bg-slate-100 text-slate-600"}`}
            aria-label="Move section up"
          >
            <FontAwesomeIcon icon={faChevronUp} />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${isActive ? "bg-white/12 text-white" : "bg-slate-100 text-slate-600"}`}
            aria-label="Move section down"
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${isActive ? "bg-rose-500/20 text-rose-100" : "bg-rose-50 text-rose-600"}`}
            aria-label="Remove section"
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
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

  const selectedSection = useMemo(() => sections.find((section) => section.id === selectedSectionId) || null, [sections, selectedSectionId]);

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

  const addSection = () => {
    const next = [...sections, createCustomSection()];
    onChange(next);
    setSelectedSectionId(next[next.length - 1].id);
  };

  const lifeItemsText = Array.isArray(selectedSection?.content?.items) ? selectedSection.content.items.join("\n") : "";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 rounded-[20px] border border-slate-200 bg-white px-4 py-3.5">
        <div>
          <p className="text-sm font-semibold text-slate-950">Page sections</p>
          <p className="mt-1 text-sm text-slate-500">Manage current sections and add custom content blocks.</p>
        </div>
        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Add new section</span>
        </button>
      </div>

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

          {selectedSection.type === "custom" ? (
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-medium text-slate-700">Section content</span>
              <textarea
                rows={7}
                value={selectedSection.content?.body || ""}
                onChange={(event) => updateContent(selectedSection.id, { body: event.target.value })}
                className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none"
              />
            </label>
          ) : null}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-5 text-sm text-slate-500">
          Select a section to edit it, or add a new custom section.
        </div>
      )}
    </div>
  );
}
