import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

const coreTechnologies = ["React", "PostgreSQL", "Node.js", "Docker", "Linux"];
const interests = ["System Design", "API Integration", "Cloud Computing"];

export function About() {
  return (
    <Section id="about">
      <Heading eyebrow="About">Get to know me</Heading>

      <div className="mt-10 grid gap-10 md:grid-cols-[280px_1fr] md:gap-16">
        <div className="reveal aspect-square w-full max-w-xs overflow-hidden rounded-xl border border-[#27272A]/15 bg-[#F8F8F8]">
          <Image
            src="/profile.png"
            alt="Profile photo"
            width={280}
            height={280}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="reveal space-y-6">
          <p className="text-base text-[#444444] sm:text-lg text-justify">
            I help businesses turn ideas into scalable web and mobile applications that solve real problems, improve efficiency, and support long-term growth. From customer-facing platforms to internal business tools and third-party integrations, I build reliable, high-performance solutions that are easy to maintain and evolve.
            <br /><br />
            My expertise includes React, React Native, Node.js, PostgreSQL, Redis, Docker and cloud platforms such as Firebase and Oracle Cloud Infrastructure. I choose technologies based on business needs, focusing on performance, security, scalability, and long-term value rather than a one-size-fits-all approach.
            <br /><br />
            Beyond development, I collaborate with teams to design clean architectures, build reusable components, reduce technical debt, and establish efficient development practices. Whether it's developing a product, or improving engineering workflows, I focus on delivering software that creates measurable business impact.
          </p>
          
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-[#7C7D80]">
              Core Technologies
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {coreTechnologies.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-[#7C7D80]">
              Interests
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge key={interest}>{interest}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
