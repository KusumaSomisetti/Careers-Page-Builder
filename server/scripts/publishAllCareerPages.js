import process from "node:process";
import { supabase } from "../src/lib/supabase.js";
import { publishCareerPage } from "../src/services/careerPageService.js";

async function main() {
  const { data: companies, error } = await supabase
    .from("companies")
    .select("slug, name")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  if (!companies?.length) {
    console.log("No companies found to publish.");
    return;
  }

  const results = [];

  for (const company of companies) {
    const published = await publishCareerPage(company.slug);
    results.push({
      company: company.name,
      slug: company.slug,
      publishedAt: published.careerPage.published?.publishedAt ?? published.careerPage.createdAt
    });
  }

  console.log(`Published ${results.length} career pages.`);
  console.table(results);
}

main().catch((error) => {
  console.error("Failed to publish career pages.");
  console.error(error);
  process.exit(1);
});
