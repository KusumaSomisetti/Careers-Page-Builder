function readRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  supabaseUrl: readRequiredEnv("SUPABASE_URL"),
  supabaseServiceRoleKey: readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")
};
