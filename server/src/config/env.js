function readRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parseAllowedOrigins(value) {
  if (!value) {
    return ["http://localhost:5173"];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  publicAppUrl: process.env.PUBLIC_APP_URL || "http://localhost:5173",
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
  supabaseUrl: readRequiredEnv("SUPABASE_URL"),
  supabaseServiceRoleKey: readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")
};
