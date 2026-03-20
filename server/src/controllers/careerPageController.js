import {
  getCareerPageEditorBySlug,
  getCareerPageShareLink,
  getPublicCareerPageBySlug,
  publishCareerPage,
  updateCareerPageDraft
} from "../services/careerPageService.js";
import { getJobsByCompanySlug } from "../services/jobService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCareerPageEditorController = asyncHandler(async (request, response) => {
  const careerPage = await getCareerPageEditorBySlug(request.params.slug);
  response.json(careerPage);
});

export const updateCareerPageDraftController = asyncHandler(async (request, response) => {
  const careerPage = await updateCareerPageDraft(request.params.slug, request.body);
  response.json(careerPage);
});

export const publishCareerPageController = asyncHandler(async (request, response) => {
  const careerPage = await publishCareerPage(request.params.slug);
  response.json(careerPage);
});

export const getCareerPageShareLinkController = asyncHandler(async (request, response) => {
  const shareLink = await getCareerPageShareLink(request.params.slug);
  response.json(shareLink);
});

export const getPublicCareerPageController = asyncHandler(async (request, response) => {
  const jobs = await getJobsByCompanySlug(request.params.slug, {
    location: request.query.location,
    type: request.query.type,
    search: request.query.search
  });
  const careerPage = await getPublicCareerPageBySlug(request.params.slug, jobs);
  response.json(careerPage);
});
