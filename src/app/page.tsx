import { Contact } from "@/components/sections/Contact";
import { FeaturedCase } from "@/components/sections/FeaturedCase";
import { Hero } from "@/components/sections/Hero/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Process } from "@/components/sections/Process";
import { PullQuote } from "@/components/sections/PullQuote";
import { Services } from "@/components/sections/Services/Services";
import { SectionSeam } from "@/components/layout/SectionSeam";
import { IntroOverlay } from "@/components/layout/IntroOverlay";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <Hero />
      <Services />
      <SectionSeam />
      <FeaturedCase />
      <SectionSeam />
      <Philosophy />
      <PullQuote />
      <Process />
      <SectionSeam />
      <Contact />
    </>
  );
}
