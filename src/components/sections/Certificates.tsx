import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { certificates } from "@/data/certificates";

export function Certificates() {
  return (
    <Section id="certificates">
      <Heading eyebrow="Credentials">Certifications</Heading>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <Card key={cert.slug} className="reveal">
            <div className="-mx-6 -mt-6 aspect-video overflow-hidden rounded-t-xl border-b border-[#27272A]/15 bg-white">
              <Image
                src={cert.image}
                alt={cert.title}
                width={400}
                height={225}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader>
              <p className="text-xs font-medium uppercase tracking-widest text-[#7C7D80]">
                {cert.organization}
              </p>
              <h3 className="text-lg font-semibold text-[#282929]">{cert.title}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#7C7D80]">Completed {cert.completedAt}</p>
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-sm font-medium text-[#333333] hover:text-[#282929]"
                >
                  View Credential
                </a>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
