import { findCompanyRecordBySlug } from "../services/companyService.js";
import { supabase } from "../lib/supabase.js";
import { HttpError } from "../utils/httpError.js";

function sanitizeText(value) {
  return String(value || "")
    .replace(/[\uFFFD\u2022\u00B7\u2219\u22C5]+/g, " - ")
    .replace(/\s+-\s+-\s+/g, " - ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function mapJob(job) {
  return {
    id: job.id,
    companyId: job.company_id,
    title: sanitizeText(job.title),
    location: sanitizeText(job.location),
    type: sanitizeText(job.type),
    summary: sanitizeText(job.summary),
    workPolicy: sanitizeText(job.work_policy),
    department: sanitizeText(job.department),
    employmentType: sanitizeText(job.employment_type),
    experienceLevel: sanitizeText(job.experience_level),
    jobType: sanitizeText(job.job_type),
    salaryRange: sanitizeText(job.salary_range),
    jobSlug: job.job_slug,
    postedDaysAgo: job.posted_days_ago,
    createdAt: job.created_at,
    updatedAt: job.updated_at
  };
}

export async function addJob(payload) {
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      company_id: payload.companyId,
      title: payload.title,
      location: payload.location,
      type: payload.type,
      summary: payload.summary ?? null,
      work_policy: payload.workPolicy ?? null,
      department: payload.department ?? null,
      employment_type: payload.employmentType ?? null,
      experience_level: payload.experienceLevel ?? null,
      job_type: payload.jobType ?? null,
      salary_range: payload.salaryRange ?? null,
      job_slug: payload.jobSlug ?? null,
      posted_days_ago: payload.postedDaysAgo ?? null
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapJob(data);
}

export async function updateJobById(id, updates) {
  const payload = {
    ...(updates.title !== undefined ? { title: updates.title } : {}),
    ...(updates.location !== undefined ? { location: updates.location } : {}),
    ...(updates.type !== undefined ? { type: updates.type } : {}),
    ...(updates.summary !== undefined ? { summary: updates.summary } : {}),
    ...(updates.workPolicy !== undefined ? { work_policy: updates.workPolicy } : {}),
    ...(updates.department !== undefined ? { department: updates.department } : {}),
    ...(updates.employmentType !== undefined ? { employment_type: updates.employmentType } : {}),
    ...(updates.experienceLevel !== undefined ? { experience_level: updates.experienceLevel } : {}),
    ...(updates.jobType !== undefined ? { job_type: updates.jobType } : {}),
    ...(updates.salaryRange !== undefined ? { salary_range: updates.salaryRange } : {}),
    ...(updates.jobSlug !== undefined ? { job_slug: updates.jobSlug } : {}),
    ...(updates.postedDaysAgo !== undefined ? { posted_days_ago: updates.postedDaysAgo } : {})
  };

  const { data, error } = await supabase
    .from("jobs")
    .update(payload)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new HttpError(404, "Job not found");
  }

  return mapJob(data);
}

export async function deleteJobById(id) {
  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new HttpError(404, "Job not found");
  }
}

export async function getJobs(filters) {
  let query = supabase
    .from("jobs")
    .select("id, company_id, title, location, type, summary, work_policy, department, employment_type, experience_level, job_type, salary_range, job_slug, posted_days_ago, created_at, updated_at, companies(name, slug)")
    .order("created_at", { ascending: false });

  if (filters.companyId) {
    query = query.eq("company_id", filters.companyId);
  }

  if (filters.location) {
    query = query.eq("location", filters.location);
  }

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data.map((job) => ({
    ...mapJob(job),
    company: Array.isArray(job.companies) ? job.companies[0] ?? null : job.companies
  }));
}

export async function getJobsByCompanySlug(slug, filters = {}) {
  const company = await findCompanyRecordBySlug(slug);

  return getJobs({
    companyId: company.id,
    location: filters.location,
    type: filters.type,
    search: filters.search
  });
}

