import { randomUUID } from "node:crypto";
import path from "node:path";
import { env } from "../config/env.js";
import { supabase } from "../lib/supabase.js";
import { findCompanyRecordBySlug } from "./companyService.js";
import { HttpError } from "../utils/httpError.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
let bucketReady = false;

function sanitizeSegment(value) {
  return String(value || "asset")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "asset";
}

function inferExtension(file) {
  const fromName = path.extname(file.originalname || "").toLowerCase();
  if (fromName) {
    return fromName;
  }

  const typeMap = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg"
  };

  return typeMap[file.mimetype] || ".jpg";
}

async function ensureBucket() {
  if (bucketReady) {
    return;
  }

  const { data, error } = await supabase.storage.getBucket(env.supabaseStorageBucket);
  if (data && !error) {
    bucketReady = true;
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(env.supabaseStorageBucket, {
    public: true,
    fileSizeLimit: "8MB",
    allowedMimeTypes: Array.from(allowedMimeTypes)
  });

  if (createError && !/exists|duplicate/i.test(createError.message || "")) {
    throw createError;
  }

  bucketReady = true;
}

export async function uploadCareerPageAsset(slug, { kind, file }) {
  if (!file) {
    throw new HttpError(400, "No file was uploaded.");
  }

  if (!allowedMimeTypes.has(file.mimetype)) {
    throw new HttpError(400, "Only image uploads are supported.");
  }

  const company = await findCompanyRecordBySlug(slug);
  await ensureBucket();

  const assetKind = sanitizeSegment(kind || "asset");
  const extension = inferExtension(file);
  const storagePath = `${company.slug}/${assetKind}/${randomUUID()}${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(env.supabaseStorageBucket)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
      cacheControl: "3600"
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(env.supabaseStorageBucket).getPublicUrl(storagePath);

  return {
    bucket: env.supabaseStorageBucket,
    path: storagePath,
    publicUrl: data.publicUrl
  };
}
