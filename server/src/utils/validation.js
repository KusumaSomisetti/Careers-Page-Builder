import { HttpError } from "../utils/httpError.js";

export function assertRequiredFields(payload, fields) {
  for (const field of fields) {
    if (!payload[field] || String(payload[field]).trim().length === 0) {
      throw new HttpError(400, `${field} is required`);
    }
  }
}
