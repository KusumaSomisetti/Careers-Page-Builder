import { findCompanyRecordBySlug } from "./companyService.js";
import { env } from "../config/env.js";
import { createDefaultCareerPageState } from "../data/defaultCareerPage.js";
import { supabase } from "../lib/supabase.js";
import { HttpError } from "../utils/httpError.js";
import {
  sanitizeBanner,
  sanitizeSections,
  sanitizeThemeSettings
} from "../utils/careerPageSanitizers.js";

function mapCareerPage(record) {
  return {
    id: record.id,
    companyId: record.company_id,
    draft: {
      themeSettings: record.draft_theme_settings,
      sections: record.draft_sections,
      banner: record.draft_banner
    },
    published: record.is_published
      ? {
          themeSettings: record.published_theme_settings,
          sections: record.published_sections,
          banner: record.published_banner,
          publishedAt: record.published_at
        }
      : null,
    isPublished: record.is_published,
    shareUrl: null,
    createdAt: record.created_at,
    updatedAt: record.updated_at
  };
}

function buildShareUrl(slug) {
  return `${env.publicAppUrl.replace(/\/$/, "")}/careers/${slug}`;
}

async function getCareerPageRecordByCompanyId(companyId) {
  const { data, error } = await supabase
    .from("career_pages")
    .select()
    .eq("company_id", companyId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function ensureCareerPageForCompany(company) {
  const currentRecord = await getCareerPageRecordByCompanyId(company.id);

  if (currentRecord) {
    return mapCareerPage(currentRecord);
  }

  const defaultState = createDefaultCareerPageState(company);

  const { data, error } = await supabase
    .from("career_pages")
    .insert({
      company_id: company.id,
      draft_theme_settings: defaultState.themeSettings,
      draft_sections: defaultState.sections,
      draft_banner: defaultState.banner
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapCareerPage(data);
}

export async function getCareerPageEditorBySlug(slug) {
  const company = await findCompanyRecordBySlug(slug);
  const record = await ensureCareerPageForCompany(company);

  return {
    company,
    careerPage: {
      ...record,
      shareUrl: buildShareUrl(company.slug)
    }
  };
}

export async function updateCareerPageDraft(slug, updates) {
  const current = await getCareerPageEditorBySlug(slug);
  const payload = {
    draft_theme_settings: updates.themeSettings
      ? sanitizeThemeSettings(updates.themeSettings)
      : current.careerPage.draft.themeSettings,
    draft_sections: updates.sections
      ? sanitizeSections(updates.sections)
      : current.careerPage.draft.sections,
    draft_banner: updates.banner
      ? sanitizeBanner(updates.banner)
      : current.careerPage.draft.banner
  };

  const { data, error } = await supabase
    .from("career_pages")
    .update(payload)
    .eq("company_id", current.company.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    company: current.company,
    careerPage: {
      ...mapCareerPage(data),
      shareUrl: buildShareUrl(current.company.slug)
    }
  };
}

export async function publishCareerPage(slug) {
  const current = await getCareerPageEditorBySlug(slug);

  const { data, error } = await supabase
    .from("career_pages")
    .update({
      published_theme_settings: current.careerPage.draft.themeSettings,
      published_sections: current.careerPage.draft.sections,
      published_banner: current.careerPage.draft.banner,
      is_published: true,
      published_at: new Date().toISOString()
    })
    .eq("company_id", current.company.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    company: current.company,
    careerPage: {
      ...mapCareerPage(data),
      shareUrl: buildShareUrl(current.company.slug)
    }
  };
}

export async function getCareerPageShareLink(slug) {
  const editor = await getCareerPageEditorBySlug(slug);

  return {
    companySlug: editor.company.slug,
    shareUrl: buildShareUrl(editor.company.slug),
    isPublished: editor.careerPage.isPublished
  };
}

export async function getPublicCareerPageBySlug(slug, jobs) {
  const editor = await getCareerPageEditorBySlug(slug);

  if (!editor.careerPage.isPublished || !editor.careerPage.published) {
    throw new HttpError(404, "Published career page not found");
  }

  return {
    company: editor.company,
    themeSettings: editor.careerPage.published.themeSettings,
    banner: editor.careerPage.published.banner,
    sections: editor.careerPage.published.sections,
    jobs,
    shareUrl: buildShareUrl(editor.company.slug),
    publishedAt: editor.careerPage.published.publishedAt
  };
}
