import { addJob, deleteJobById, getJobs, updateJobById } from "../services/jobService.js";
import { findCompanyRecordBySlug } from "../services/companyService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { assertRequiredFields } from "../utils/validation.js";

export const addJobController = asyncHandler(async (request, response) => {
  assertRequiredFields(request.body, ["title", "location", "type"]);

  const company = await findCompanyRecordBySlug(request.params.slug);
  const job = await addJob({
    companyId: company.id,
    ...request.body
  });

  response.status(201).json(job);
});

export const updateJobController = asyncHandler(async (request, response) => {
  const job = await updateJobById(request.params.id, request.body);
  response.json(job);
});

export const deleteJobController = asyncHandler(async (request, response) => {
  await deleteJobById(request.params.id);
  response.status(204).send();
});

export const getJobsController = asyncHandler(async (request, response) => {
  let companyId;

  if (request.query.companySlug) {
    const company = await findCompanyRecordBySlug(request.query.companySlug);
    companyId = company.id;
  }

  const jobs = await getJobs({
    companyId,
    location: request.query.location,
    type: request.query.type,
    search: request.query.search
  });

  response.json(jobs);
});
