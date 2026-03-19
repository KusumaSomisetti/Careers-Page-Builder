export const dashboardSections = [
  { id: "company", label: "Company" },
  { id: "about", label: "About" },
  { id: "jobs", label: "Jobs" }
];

export const initialCareerPage = {
  company: {
    name: "Northstar",
    logo: "NS",
    banner: "Build thoughtful tools that help ambitious teams hire with clarity."
  },
  about:
    "We design software that makes hiring feel calm, organized, and deeply human for every company we work with. Our team values clarity, trust, and a strong sense of craft in every detail.",
  jobs: [
    {
      id: "job-1",
      title: "Senior Product Designer",
      location: "Remote",
      type: "Full-time",
      summary: "Shape elegant workflows for recruiters, hiring teams, and candidates."
    },
    {
      id: "job-2",
      title: "Frontend Engineer",
      location: "Bengaluru or Remote",
      type: "Full-time",
      summary: "Build polished, fast interfaces with strong attention to craft and usability."
    },
    {
      id: "job-3",
      title: "Customer Success Lead",
      location: "London or Remote",
      type: "Full-time",
      summary: "Partner with customers to launch branded career experiences that convert."
    }
  ]
};
