import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/data/site";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Resume",
};

export default function ResumePage() {
    const downloadFilename = `${site.name.trim().replace(/\s+/g, "_")}.pdf`;

    return (
        <div className="flex min-h-full flex-1 flex-col">
            <Navbar />
            <main className="flex-1 py-12 sm:py-16">
                <Container>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7C7D80] transition-colors duration-300 hover:text-[#333333]"
                    >
                        &larr; Back
                    </Link>
                    <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <Heading eyebrow="Resume">{site.name}&apos;s Resume</Heading>
                        <ButtonLink href={site.resumeUrl} download={downloadFilename} className="w-full sm:w-auto">
                            Download Resume
                        </ButtonLink>
                    </div>
                    <p className="mt-3 max-w-xl text-base text-[#444444]">
                        View my latest resume below, or download a copy to keep.
                    </p>

                    <iframe
                        src={site.resumeUrl}
                        title={`${site.name} — Resume`}
                        // sandbox="allow-same-origin"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="mt-8 h-[80vh] w-full rounded-xl border border-[#27272A]/15 bg-white"
                        width="900" 
                        height="900"
                    >
                        <p className="p-6 text-sm text-[#444444]">
                            Your browser doesn&apos;t support embedded PDFs.{" "}
                            <a
                                href={site.resumeUrl}
                                download={downloadFilename}
                                className="font-medium text-[#333333] underline underline-offset-2"
                            >
                                Download the resume instead
                            </a>
                            .
                        </p>
                    </iframe>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
