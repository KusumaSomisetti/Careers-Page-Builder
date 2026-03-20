import { HttpError } from "../utils/httpError.js";

export function errorHandler(error, _request, response, _next) {
  const status = error.status || 500;
  const message = status >= 500 ? "Internal server error" : error.message;

  if (status >= 500) {
    console.error(error);
  }

  response.status(status).json({
    error: message
  });
}

export function notFoundHandler(_request, response) {
  response.status(404).json({
    error: "Route not found"
  });
}
