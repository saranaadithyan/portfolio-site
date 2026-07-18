export type SkillCategory = {
  category: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    category: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express"],
  },
  {
    category: "Cloud",
    skills: ["Oracle Cloud Infrastructure", "Docker", "GitHub Actions"],
  },
];
