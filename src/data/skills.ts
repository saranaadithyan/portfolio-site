export type SkillCategory = {
  category: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    category: "Web Development",
    skills: ["Next Js", "Redux", "Javascript"],
  },
  {
    category: "Backend & Database",
    skills: [
      "PostgreSQL",
      "REST APIs",
      "Redis",
      "JWT",
      "Express Js",
      "Bull MQ",
      "Clickhouse",
      "Kafka",
    ],
  },
  {
    category: "Product & Third-Party Integrations",
    skills: [
      "Zoho (Zoho APIs)",
      "Meta (WhatsApp Business APIs)",
      "Razorpay (Payment Integrations)"
    ],
  },
  {
    category: "Cloud & DevOps",
    skills: [
      "Firebase",
      "Docker",
      "Oracle Cloud Infrastructure (OCI)",
    ],
  },
  {
    category: "Version Control & Tools",
    skills: ["Github", "Bitbucket", "Postman", "Linux"],
  },
  {
    category: "Mobile Development",
    skills: ["React Native"],
  },
];