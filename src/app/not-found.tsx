import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <Container>
          <Heading as="h1" eyebrow="404">
            Page not found
          </Heading>
          <p className="mt-3 max-w-xl text-base text-[#444444]">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <div className="mt-8">
            <ButtonLink href="/">Back to home</ButtonLink>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
