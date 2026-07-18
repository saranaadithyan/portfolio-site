export type Certificate = {
  slug: string;
  title: string;
  organization: string;
  image: string;
  completedAt: string;
  credentialUrl?: string;
};

export const certificates: Certificate[] = [
  {
    slug: "certificate-one",
    title: "Claude Code in Action",
    organization: "Anthropic",
    image: "/placeholder-certificate.png",
    completedAt: "2026-03",
    credentialUrl: "https://verify.skilljar.com/c/gundycbymkvg",
  },
  {
    slug: "certificate-two",
    title: "Fundamental AI Concepts",
    organization: "Microsoft",
    image: "/placeholder-certificate.png",
    completedAt: "2025-05",
    credentialUrl: "https://learn.microsoft.com/api/achievements/share/en-gb/SaranAadithyanV-7331/NVQHSQMF?sharingId=48F6BAC65A768452",
  },
  {
    slug: "certificate-three",
    title: "Introduction to machine learning concepts",
    organization: "Microsoft",
    image: "/placeholder-certificate.png",
    completedAt: "2025-03",
    credentialUrl: "https://learn.microsoft.com/api/achievements/share/en-gb/SaranAadithyanV-7331/PGZ6JJU4?sharingId=48F6BAC65A768452",
  },
  {
    slug: "certificate-four",
    title: "Oracle Cloud Infrastructure Certified Foundations Associate",
    organization: "Oracle",
    image: "/placeholder-certificate.png",
    completedAt: "2026-06",
    credentialUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=C6EC07F1E150793422EEB673B88ED09809133461CD5232AC4DEA7D3E7D2A46FE",
  },
  {
    slug: "certificate-five",
    title: "Oracle Cloud Infrastructure Certified AI Foundations Associate",
    organization: "Oracle",
    image: "/placeholder-certificate.png",
    completedAt: "2026-06",
    credentialUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=EDB9EBF040A2736FA18C9C33CD89838CAA89395A5B89549819E0673DA73EF475",
  },
];