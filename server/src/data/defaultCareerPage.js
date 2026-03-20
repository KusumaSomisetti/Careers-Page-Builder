export const defaultThemeSettings = {
  primaryColor: "#0f172a",
  secondaryColor: "#475569",
  accentColor: "#0f766e",
  bannerImageUrl: null,
  logoImageUrl: null,
  logoText: null,
  cultureVideoUrl: null
};

export const defaultSections = [
  {
    id: "about-us",
    type: "about_us",
    title: "About Us",
    isVisible: true,
    content: {
      body: "Tell candidates what makes your company worth joining."
    }
  },
  {
    id: "life-at-company",
    type: "life_at_company",
    title: "Life at Company",
    isVisible: true,
    content: {
      headline: "Show how your team works and grows together.",
      items: []
    }
  },
  {
    id: "open-roles",
    type: "open_roles",
    title: "Open Roles",
    isVisible: true,
    content: {
      headline: "Explore current opportunities"
    }
  }
];

export function createDefaultCareerPageState(company = {}) {
  return {
    themeSettings: {
      ...defaultThemeSettings,
      logoText: company.logo ?? defaultThemeSettings.logoText
    },
    sections: defaultSections,
    banner: {
      headline: `Careers at ${company.name || 'Your Company'}`,
      subheadline: company.banner || "Build a careers experience that reflects your brand.",
      imageUrl: null
    }
  };
}
