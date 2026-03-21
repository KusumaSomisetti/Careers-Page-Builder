import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export function getErrorMessage(error, fallbackMessage) {
  return error.response?.data?.error || fallbackMessage;
}

export async function fetchCompanies() {
  const response = await api.get("/companies");
  return response.data;
}

export async function fetchCompanyBySlug(slug) {
  const response = await api.get(`/companies/${slug}`);
  return response.data;
}

export async function createCompany(payload) {
  const response = await api.post("/companies", payload);
  return response.data;
}

export async function updateCompany(slug, payload) {
  const response = await api.patch(`/companies/${slug}`, payload);
  return response.data;
}

export async function fetchCareerPageEditor(slug) {
  const response = await api.get(`/companies/${slug}/career-page`);
  return response.data;
}

export async function updateCareerPageDraft(slug, payload) {
  const response = await api.patch(`/companies/${slug}/career-page`, payload);
  return response.data;
}

export async function publishCareerPage(slug) {
  const response = await api.post(`/companies/${slug}/career-page/publish`);
  return response.data;
}

export async function fetchCareerPageShareLink(slug) {
  const response = await api.get(`/companies/${slug}/career-page/share-link`);
  return response.data;
}

export async function fetchJobs(filters = {}) {
  const response = await api.get("/jobs", {
    params: {
      companySlug: filters.companySlug,
      location: filters.location,
      type: filters.type,
      search: filters.search
    }
  });

  return response.data;
}

export async function createJob(companySlug, payload) {
  const response = await api.post(`/companies/${companySlug}/jobs`, payload);
  return response.data;
}

export async function updateJob(jobId, payload) {
  const response = await api.patch(`/jobs/${jobId}`, payload);
  return response.data;
}

export async function fetchPublicCareerPage(slug, filters = {}) {
  const response = await api.get(`/careers/${slug}`, {
    params: {
      location: filters.location,
      type: filters.type,
      search: filters.search
    }
  });

  return response.data;
}
