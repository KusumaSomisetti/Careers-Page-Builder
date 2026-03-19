import { supabase } from "../lib/supabase.js";
import { createSlug } from "../utils/createSlug.js";
import { HttpError } from "../utils/httpError.js";

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
  const slug = payload.slug ? createSlug(payload.slug) : createSlug(payload.name);

  const { data, error } = await supabase
    .from("companies")
    .insert({
      name: payload.name,
      slug,
      logo: payload.logo ?? null,
      banner: payload.banner ?? null,
      about: payload.about ?? null
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new HttpError(409, "Company slug already exists");
    }

    throw error;
  }

  return mapCompany(data);
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
  const payload = {
    ...(updates.name !== undefined ? { name: updates.name } : {}),
    ...(updates.slug !== undefined ? { slug: createSlug(updates.slug) } : {}),
    ...(updates.logo !== undefined ? { logo: updates.logo } : {}),
    ...(updates.banner !== undefined ? { banner: updates.banner } : {}),
    ...(updates.about !== undefined ? { about: updates.about } : {})
  };

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

  return mapCompany(data);
}

export async function findCompanyRecordBySlug(slug) {
  const { data, error } = await supabase
    .from("companies")
    .select("id, slug")
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
