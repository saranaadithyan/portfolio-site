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
    title: "Certificate Title One",
    organization: "Issuing Organization",
    image: "/placeholder-certificate.svg",
    completedAt: "2025-01",
    credentialUrl: "https://example.com/credential/one",
  },
  {
    slug: "certificate-two",
    title: "Certificate Title Two",
    organization: "Issuing Organization",
    image: "/placeholder-certificate.svg",
    completedAt: "2025-06",
    credentialUrl: "https://example.com/credential/two",
  },
];
