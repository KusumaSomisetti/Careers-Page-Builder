import crypto from "node:crypto";
import path from "node:path";
import process from "node:process";
import ExcelJS from "exceljs";
import { sampleCompanies } from "../src/data/sampleCompanies.js";
import { createCompany, getCompanyBySlug } from "../src/services/companyService.js";
import { addJob, getJobs } from "../src/services/jobService.js";

const defaultFilePath = process.argv[2] || "C:/Users/KUSUMA/Downloads/Sample Jobs Data.xlsx";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function createSummary(row) {
  const details = [row.department, row.experience_level, row.work_policy, row.salary_range].filter(Boolean);
  return `Join the ${row.department} team as a ${row.title}. ${details.join(" • ")}`;
}

function getStableCompanyIndex(seed, total) {
  const hash = crypto.createHash("sha256").update(seed).digest("hex");
  return Number.parseInt(hash.slice(0, 8), 16) % total;
}

function normalizeDaysAgo(value) {
  if (!value) {
    return null;
  }

  const match = String(value).match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : null;
}

function createJobSlug(row, rowNumber) {
  if (row.job_slug) {
    return slugify(row.job_slug);
  }

  const base = [row.title, row.location, row.department].filter(Boolean).join(" ");
  const generated = slugify(base);
  return generated.length > 0 ? generated : `imported-job-${rowNumber}`;
}

async function ensureCompanies() {
  const companies = [];

  for (const company of sampleCompanies) {
    try {
      companies.push(await createCompany(company));
    } catch (error) {
      if (error.status === 409) {
        companies.push(await getCompanyBySlug(company.slug));
      } else {
        throw error;
      }
    }
  }

  return new Map(companies.map((company) => [company.slug, company]));
}

async function readRows(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  const headerRow = worksheet.getRow(1);
  const headers = headerRow.values.slice(1).map((value) => String(value || "").trim());

  return worksheet.getRows(2, worksheet.rowCount - 1).map((row, index) => {
    const values = row.values.slice(1);
    const record = headers.reduce((accumulator, header, columnIndex) => {
      accumulator[header] = values[columnIndex] ?? "";
      return accumulator;
    }, {});

    record.__rowNumber = index + 2;
    return record;
  });
}

function buildJobPayloads(rows, companiesBySlug) {
  const uniqueJobs = new Map();
  let duplicateCount = 0;

  for (const row of rows) {
    const normalizedSlug = createJobSlug(row, row.__rowNumber);
    const companyTemplate = sampleCompanies[
      getStableCompanyIndex(normalizedSlug || row.title || String(row.__rowNumber), sampleCompanies.length)
    ];
    const company = companiesBySlug.get(companyTemplate.slug);
    const uniqueKey = `${company.id}::${normalizedSlug}`;

    if (uniqueJobs.has(uniqueKey)) {
      duplicateCount += 1;
      continue;
    }

    uniqueJobs.set(uniqueKey, {
      companyId: company.id,
      title: row.title,
      location: row.location,
      type: row.employment_type,
      summary: createSummary(row),
      workPolicy: row.work_policy,
      department: row.department,
      employmentType: row.employment_type,
      experienceLevel: row.experience_level,
      jobType: row.job_type,
      salaryRange: row.salary_range,
      jobSlug: normalizedSlug,
      postedDaysAgo: normalizeDaysAgo(row.posted_days_ago)
    });
  }

  return {
    jobs: [...uniqueJobs.values()],
    duplicateCount
  };
}

async function syncJobs(jobs) {
  for (const job of jobs) {
    const existing = await getJobs({ companyId: job.companyId, search: job.title });
    const matched = existing.find((item) => item.jobSlug === job.jobSlug);

    if (!matched) {
      await addJob(job);
    }
  }

  return jobs.length;
}

function buildDistribution(jobs, companiesBySlug) {
  const companiesById = new Map([...companiesBySlug.values()].map((company) => [company.id, company]));

  return jobs.reduce((accumulator, job) => {
    const company = companiesById.get(job.companyId);
    const key = company?.name || "Unknown";
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
}

async function main() {
  const filePath = path.resolve(defaultFilePath);
  const rows = await readRows(filePath);
  const companiesBySlug = await ensureCompanies();
  const { jobs, duplicateCount } = buildJobPayloads(rows, companiesBySlug);
  const insertedCount = await syncJobs(jobs);
  const distribution = buildDistribution(jobs, companiesBySlug);

  console.log(`Imported ${insertedCount} jobs from ${filePath}`);
  console.log(`Skipped ${duplicateCount} duplicate spreadsheet rows during import.`);
  console.table(distribution);
}

main().catch((error) => {
  console.error("Sample jobs import failed.");
  console.error(error);
  process.exit(1);
});
