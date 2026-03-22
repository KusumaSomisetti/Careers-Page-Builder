import {
  createCompany,
  getCompanyBySlug,
  listCompanies,
  loginCompanyByName,
  updateCompanyBySlug
} from "../services/companyService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { assertRequiredFields } from "../utils/validation.js";

export const listCompaniesController = asyncHandler(async (_request, response) => {
  const companies = await listCompanies();
  response.json(companies);
});

export const loginCompanyController = asyncHandler(async (request, response) => {
  assertRequiredFields(request.body, ["name", "password"]);

  const company = await loginCompanyByName(request.body.name, request.body.password);
  response.json(company);
});

export const createCompanyController = asyncHandler(async (request, response) => {
  assertRequiredFields(request.body, ["name", "password"]);

  const company = await createCompany(request.body);
  response.status(201).json(company);
});

export const getCompanyBySlugController = asyncHandler(async (request, response) => {
  const company = await getCompanyBySlug(request.params.slug);
  response.json(company);
});

export const updateCompanyController = asyncHandler(async (request, response) => {
  const company = await updateCompanyBySlug(request.params.slug, request.body);
  response.json(company);
});
