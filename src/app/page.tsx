import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { Showcase } from "@/components/landing/showcase";
import { Stats } from "@/components/landing/stats";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#020202] text-white selection:bg-yellow-500/30 overflow-x-hidden">
      <Navbar />
      <Hero />
      <Showcase />
      <Features />
      <Stats />
      <CTA />
      <Footer />
    </main>
  );
}
