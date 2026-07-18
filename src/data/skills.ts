export type SkillCategory = {
  category: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    category: "Web Development",
    skills: ["React Js", "Redux", "Javascript"],
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
    category: "Mobile Development",
    skills: ["React Native"],
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
    category: "Product & Third-Party Integrations",
    skills: [
      "Zoho (Zoho APIs)",
      "Meta (WhatsApp Business APIs)",
    ],
  },
];