import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Blogs } from "@/components/sections/Blogs";
import { Certificates } from "@/components/sections/Certificates";
import { ScrollRevealInit } from "@/components/layout/ScrollRevealInit";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <ScrollRevealInit />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Blogs />
        <Certificates />
      </main>
      <Footer />
    </div>
  );
}
