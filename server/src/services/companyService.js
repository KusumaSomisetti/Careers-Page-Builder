import { ensureCareerPageForCompany, publishCareerPage } from "./careerPageService.js";
import { env } from "../config/env.js";
import { supabase } from "../lib/supabase.js";
import { createSlug } from "../utils/createSlug.js";
import { HttpError } from "../utils/httpError.js";
import { sanitizeCompanyPayload } from "../utils/careerPageSanitizers.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

function buildShareUrl(slug) {
  return `${env.publicAppUrl.replace(/\/$/, "")}/careers/${slug}`;
}

function mapCompany(company, careerPage = null) {
  const themeSettings = careerPage?.draft_theme_settings || null;

  return {
    id: company.id,
    name: company.name,
    slug: company.slug,
    logo: company.logo,
    banner: company.banner,
    about: company.about,
    logoText: themeSettings?.logoText || company.logo || null,
    logoImageUrl: themeSettings?.logoImageUrl || null,
    shareUrl: buildShareUrl(company.slug),
    createdAt: company.created_at,
    updatedAt: company.updated_at
  };
}

export async function listCompanies() {
  const { data: companies, error: companiesError } = await supabase
    .from("companies")
    .select("id, name, slug, logo, banner, about, created_at, updated_at")
    .order("name", { ascending: true });

  if (companiesError) {
    throw companiesError;
  }

  const companyIds = companies.map((company) => company.id);

  let careerPagesByCompanyId = new Map();

  if (companyIds.length > 0) {
    const { data: careerPages, error: careerPagesError } = await supabase
      .from("career_pages")
      .select("company_id, draft_theme_settings")
      .in("company_id", companyIds);

    if (careerPagesError) {
      throw careerPagesError;
    }

    careerPagesByCompanyId = new Map(careerPages.map((careerPage) => [careerPage.company_id, careerPage]));
  }

  return companies.map((company) => mapCompany(company, careerPagesByCompanyId.get(company.id)));
}

export async function createCompany(payload) {
  const companyPayload = sanitizeCompanyPayload({
    ...payload,
    slug: payload.slug ? payload.slug : createSlug(payload.name)
  });
  const password = String(payload.password || "").trim();

  if (password.length < 8) {
    throw new HttpError(400, "Password must be at least 8 characters");
  }

  const { data, error } = await supabase
    .from("companies")
    .insert({
      ...companyPayload,
      password: hashPassword(password)
    })
    .select("id, name, slug, logo, banner, about, created_at, updated_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new HttpError(409, "Company name or slug already exists");
    }

    throw error;
  }

  const company = mapCompany(data);
  await ensureCareerPageForCompany(company);
  await publishCareerPage(company.slug);
  return company;
}

export async function loginCompanyByName(name, password) {
  const normalizedName = String(name || "").trim();
  const normalizedPassword = String(password || "");

  const { data, error } = await supabase
    .from("companies")
    .select("id, name, slug, logo, banner, about, password, created_at, updated_at")
    .ilike("name", normalizedName)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new HttpError(401, "Invalid company name or password");
  }

  const passwordCheck = verifyPassword(normalizedPassword, data.password);

  if (!passwordCheck.isValid) {
    throw new HttpError(401, "Invalid company name or password");
  }

  if (passwordCheck.needsUpgrade) {
    const upgradedPassword = hashPassword(normalizedPassword);

    const { error: updateError } = await supabase
      .from("companies")
      .update({ password: upgradedPassword })
      .eq("id", data.id);

    if (updateError) {
      throw updateError;
    }
  }

  return mapCompany(data);
}

export async function getCompanyBySlug(slug) {
  const { data, error } = await supabase
    .from("companies")
    .select("id, name, slug, logo, banner, about, created_at, updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new HttpError(404, "Company not found");
  }

  return mapCompany(data);
}

export async function updateCompanyBySlug(slug, updates) {
  const payload = sanitizeCompanyPayload(updates);

  const { data, error } = await supabase
    .from("companies")
    .update(payload)
    .eq("slug", slug)
    .select("id, name, slug, logo, banner, about, created_at, updated_at")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      throw new HttpError(409, "Company name or slug already exists");
    }

    throw error;
  }

  if (!data) {
    throw new HttpError(404, "Company not found");
  }

  const company = mapCompany(data);
  await ensureCareerPageForCompany(company);
  await publishCareerPage(company.slug);
  return company;
}

export async function findCompanyRecordBySlug(slug) {
  const { data, error } = await supabase
    .from("companies")
    .select("id, slug, name, logo, banner, about")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new HttpError(404, "Company not found");
  }

  return data;
}
