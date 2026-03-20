import { ensureCareerPageForCompany } from "./careerPageService.js";
import { supabase } from "../lib/supabase.js";
import { createSlug } from "../utils/createSlug.js";
import { HttpError } from "../utils/httpError.js";
import { sanitizeCompanyPayload } from "../utils/careerPageSanitizers.js";

function mapCompany(company) {
  return {
    id: company.id,
    name: company.name,
    slug: company.slug,
    logo: company.logo,
    banner: company.banner,
    about: company.about,
    createdAt: company.created_at,
    updatedAt: company.updated_at
  };
}

export async function listCompanies() {
  const { data, error } = await supabase
    .from("companies")
    .select()
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(mapCompany);
}

export async function createCompany(payload) {
  const companyPayload = sanitizeCompanyPayload({
    ...payload,
    slug: payload.slug ? payload.slug : createSlug(payload.name)
  });

  const { data, error } = await supabase
    .from("companies")
    .insert(companyPayload)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new HttpError(409, "Company slug already exists");
    }

    throw error;
  }

  const company = mapCompany(data);
  await ensureCareerPageForCompany(company);
  return company;
}

export async function getCompanyBySlug(slug) {
  const { data, error } = await supabase
    .from("companies")
    .select()
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
    .select()
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      throw new HttpError(409, "Company slug already exists");
    }

    throw error;
  }

  if (!data) {
    throw new HttpError(404, "Company not found");
  }

  const company = mapCompany(data);
  await ensureCareerPageForCompany(company);
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
