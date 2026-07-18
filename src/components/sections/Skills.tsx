import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { skillCategories } from "@/data/skills";

export function Skills() {
  return (
    <Section id="skills" withTopBorder={false}>
      <Heading eyebrow="Skills">What I work with</Heading>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((category) => (
          <Card key={category.category} className="reveal">
            <CardHeader>
              <h3 className="text-lg font-semibold text-[#282929]">{category.category}</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
