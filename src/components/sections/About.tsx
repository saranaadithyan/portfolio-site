import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

const coreTechnologies = ["React", "Next.js", "TypeScript", "Node.js", "Docker"];
const interests = ["Open Source", "System Design", "Photography", "Chess"];

export function About() {
  return (
    <Section id="about">
      <Heading eyebrow="About">Get to know me</Heading>

      <div className="mt-10 grid gap-10 md:grid-cols-[280px_1fr] md:gap-16">
        <div className="reveal aspect-square w-full max-w-xs overflow-hidden rounded-xl border border-[#27272A]/15 bg-[#F8F8F8]">
          <Image
            src="/placeholder-profile.svg"
            alt="Profile photo"
            width={280}
            height={280}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="reveal space-y-6">
          <p className="text-base text-[#444444] sm:text-lg">
            Placeholder professional summary. Describe your background, what you build, and the
            kind of problems you enjoy solving.
          </p>

          {/* <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium uppercase tracking-widest text-[#7C7D80]">
                Experience
              </dt>
              <dd className="mt-1 text-[#444444]">X years building web applications</dd>
            </div>
            <div>
              <dt className="text-sm font-medium uppercase tracking-widest text-[#7C7D80]">
                Current Role
              </dt>
              <dd className="mt-1 text-[#444444]">Your current role, Company</dd>
            </div>
          </dl> */}

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
