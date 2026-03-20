import { createSlug } from "../utils/createSlug.js";

function normalizeSection(section, index) {
  return {
    id: section.id || `${section.type || 'section'}-${index + 1}`,
    type: section.type || "custom",
    title: section.title || `Section ${index + 1}`,
    isVisible: section.isVisible ?? true,
    content: section.content ?? {}
  };
}

export function sanitizeThemeSettings(themeSettings = {}) {
  return {
    primaryColor: themeSettings.primaryColor ?? "#0f172a",
    secondaryColor: themeSettings.secondaryColor ?? "#475569",
    accentColor: themeSettings.accentColor ?? "#0f766e",
    bannerImageUrl: themeSettings.bannerImageUrl ?? null,
    logoImageUrl: themeSettings.logoImageUrl ?? null,
    logoText: themeSettings.logoText ?? null,
    cultureVideoUrl: themeSettings.cultureVideoUrl ?? null
  };
}

export function sanitizeBanner(banner = {}) {
  return {
    headline: banner.headline ?? "Careers",
    subheadline: banner.subheadline ?? "Build a careers experience that reflects your brand.",
    imageUrl: banner.imageUrl ?? null
  };
}

export function sanitizeSections(sections = []) {
  return sections.map(normalizeSection);
}

export function sanitizeCompanyPayload(payload = {}) {
  return {
    ...(payload.name !== undefined ? { name: payload.name } : {}),
    ...(payload.slug !== undefined ? { slug: createSlug(payload.slug) } : {}),
    ...(payload.logo !== undefined ? { logo: payload.logo } : {}),
    ...(payload.banner !== undefined ? { banner: payload.banner } : {}),
    ...(payload.about !== undefined ? { about: payload.about } : {})
  };
}
