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
            I build technology that helps businesses grow, turning manual processes into automated workflows and ideas into scalable web applications that solve real problems and improve efficiency. From customer-facing platforms to internal business tools and third-party integrations like WhatsApp, payments and CRM systems, I build reliable, high-performance solutions that are easy to maintain and evolve.
            <br /><br />
            I bring a product-centric mindset to every project. I start with the business problem and the user, then choose technology based on impact, performance, security and long-term value rather than a one-size-fits-all approach. My core stack includes React, Node.js, PostgreSQL, Redis and Docker, with cloud experience on Firebase, Google Cloud and Oracle Cloud Infrastructure.
            <br /><br />
            I&apos;m also growing toward product ownership, shaping what gets built and why while staying hands-on with the code. I collaborate closely with tech teams on architecture and technical discussions, design clean, reusable systems, reduce technical debt and improve development practices, so the software I deliver creates measurable business impact.
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
